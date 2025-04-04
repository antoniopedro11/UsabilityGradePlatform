import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Função para verificar se o usuário tem permissão para acessar o template
async function verifyPermission(templateId: string) {
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
    
    // Verificar se o template existe e pertence ao usuário
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, creatorId: true }
    });
    
    if (!template) {
      return { authorized: false, message: "Template não encontrado" };
    }
    
    // Verificar se o usuário é o criador do template ou é um administrador
    const isCreator = template.creatorId === userData.id;
    const isAdmin = userData.role === "ADMIN";
    
    if (!isCreator && !isAdmin) {
      return { authorized: false, message: "Você não tem permissão para acessar este template" };
    }
    
    return { 
      authorized: true, 
      userId: userData.id,
      isAdmin 
    };
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return { authorized: false, message: "Erro ao verificar permissão" };
  }
}

// Obter um template específico
export async function GET(
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
    
    // Buscar o template com informações dos formulários
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        forms: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            status: true,
            _count: {
              select: { questions: true }
            }
          }
        },
        _count: {
          select: { forms: true }
        }
      }
    });
    
    if (!template) {
      return NextResponse.json(
        { error: "Template não encontrado" },
        { status: 404 }
      );
    }
    
    // Formatar o template para a resposta
    const formattedTemplate = {
      ...template,
      forms: template.forms.map(form => ({
        ...form,
        questionsCount: form._count.questions
      })),
      formsCount: template._count.forms
    };
    
    return NextResponse.json({ template: formattedTemplate });
  } catch (error) {
    console.error("Erro ao buscar template:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}

// Atualizar um template
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
    const { title, description, status, forms } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }
    
    // Atualizar o template
    const template = await prisma.template.update({
      where: { id },
      data: {
        title,
        description,
        status: status || undefined,
        ...(forms ? {
          forms: {
            set: [], // Limpar associações existentes
            connect: forms.map((formId: string) => ({ id: formId }))
          }
        } : {})
      },
      include: {
        _count: {
          select: { forms: true }
        }
      }
    });
    
    return NextResponse.json({
      template: {
        ...template,
        formsCount: template._count.forms
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar template:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}

// Excluir um template
export async function DELETE(
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
    
    // Excluir o template
    await prisma.template.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: "Template excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir template:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
} 