import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Função para verificar se o usuário tem permissão para acessar a aplicação
async function verifyPermission(applicationId: string) {
  try {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      return { authorized: false, message: "Não autorizado" };
    }
    
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    if (!userData.id) {
      return { authorized: false, message: "Usuário não identificado" };
    }
    
    // Verificar se a aplicação existe
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, submitterId: true }
    });
    
    if (!application) {
      return { authorized: false, message: "Aplicação não encontrada" };
    }
    
    // Verificar se o usuário é o criador da aplicação ou é um administrador/revisor
    const isSubmitter = application.submitterId === userData.id;
    const isAdmin = userData.role === "ADMIN";
    
    if (!isSubmitter && !isAdmin) {
      return { authorized: false, message: "Você não tem permissão para acessar esta aplicação" };
    }
    
    return { 
      authorized: true, 
      userId: userData.id,
      isAdmin,
      isSubmitter
    };
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return { authorized: false, message: "Erro ao verificar permissão" };
  }
}

// Obter uma aplicação específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Obter os cookies para autenticação
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    if (!userData.id) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }

    // Obter a aplicação pelo ID
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Verificar se a aplicação existe
    if (!application) {
      return NextResponse.json(
        { error: "Aplicação não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para ver esta aplicação
    // Administradores podem ver todas as aplicações
    // Usuários normais só podem ver suas próprias aplicações
    if (userData.role !== "ADMIN" && application.submitterId !== userData.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para acessar esta aplicação" },
        { status: 403 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Erro ao buscar aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aplicação" },
      { status: 500 }
    );
  }
}

// Atualizar uma aplicação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar permissão
    const permission = await verifyPermission(id);
    if (!permission.authorized) {
      return NextResponse.json(
        { error: permission.message },
        { status: 401 }
      );
    }
    
    // Obter dados da requisição
    const body = await request.json();
    const { name, description, url, type, status, screenshots, feedback, assignedReviewer } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome da aplicação é obrigatório" },
        { status: 400 }
      );
    }
    
    // Criar objeto de dados para atualização
    const updateData: any = {
      name,
      description,
      url,
      type,
      screenshots
    };
    
    // Apenas administradores podem alterar o status, feedback e revisor
    if (permission.isAdmin) {
      if (status) updateData.status = status;
      if (feedback !== undefined) updateData.feedback = feedback;
      if (assignedReviewer !== undefined) updateData.assignedReviewer = assignedReviewer || null;
    }
    
    // Atualizar a aplicação
    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Erro ao atualizar aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}

// Excluir uma aplicação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Obter os cookies para autenticação
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    if (!userData.id) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }

    // Obter a aplicação pelo ID
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    // Verificar se a aplicação existe
    if (!application) {
      return NextResponse.json(
        { error: "Aplicação não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para excluir esta aplicação
    // Administradores podem excluir todas as aplicações
    // Usuários normais só podem excluir suas próprias aplicações e apenas se estiverem pendentes
    if (
      userData.role !== "ADMIN" && 
      (application.submitterId !== userData.id || application.status !== "PENDING")
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta aplicação" },
        { status: 403 }
      );
    }

    // Excluir a aplicação
    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir aplicação" },
      { status: 500 }
    );
  }
} 