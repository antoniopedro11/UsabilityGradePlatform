import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

// GET: Obter uma aplicação específica pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autenticação (opcional para visualização pública)
    const session = await auth();
    
    // Buscar a aplicação pelo ID
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: "Aplicação não encontrada" },
        { status: 404 }
      );
    }
    
    // Verificar permissão (se quiser restringir acesso)
    // Se não for o criador ou um administrador, negar acesso
    // if (session?.user?.id !== application.submitterId && session?.user?.role !== "admin") {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    // }
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Erro ao buscar aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aplicação" },
      { status: 500 }
    );
  }
}

// PATCH: Atualizar uma aplicação específica
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar a aplicação para verificar permissão
    const existingApplication = await prisma.application.findUnique({
      where: { id },
      select: { submitterId: true },
    });
    
    if (!existingApplication) {
      return NextResponse.json(
        { error: "Aplicação não encontrada" },
        { status: 404 }
      );
    }
    
    // Verificar se o usuário é o criador da aplicação ou um administrador
    if (session.user.id !== existingApplication.submitterId && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta aplicação" },
        { status: 403 }
      );
    }
    
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Atualizar a aplicação
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        url: body.url,
        status: body.status,
        // Apenas permitir atualizar o revisor se for administrador
        ...(session.user.role === "admin" && body.reviewerId
          ? { reviewerId: body.reviewerId }
          : {}),
      },
    });
    
    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Erro ao atualizar aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar aplicação" },
      { status: 500 }
    );
  }
}

// DELETE: Excluir uma aplicação específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar a aplicação para verificar permissão
    const existingApplication = await prisma.application.findUnique({
      where: { id },
      select: { submitterId: true },
    });
    
    if (!existingApplication) {
      return NextResponse.json(
        { error: "Aplicação não encontrada" },
        { status: 404 }
      );
    }
    
    // Verificar se o usuário é o criador da aplicação ou um administrador
    if (session.user.id !== existingApplication.submitterId && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta aplicação" },
        { status: 403 }
      );
    }
    
    // Excluir a aplicação
    await prisma.application.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: "Aplicação excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir aplicação" },
      { status: 500 }
    );
  }
} 