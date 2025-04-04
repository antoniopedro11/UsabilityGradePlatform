import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// Função auxiliar para verificar autenticação via cookie
async function getUserFromCookie() {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get("userData");
  
  if (!userDataCookie || !userDataCookie.value) {
    return null;
  }
  
  try {
    return JSON.parse(decodeURIComponent(userDataCookie.value));
  } catch (error) {
    console.error("Erro ao parsear cookie:", error);
    return null;
  }
}

// GET: Obter uma aplicação específica pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autenticação via cookie (opcional para visualização)
    const userData = await getUserFromCookie();
    
    // Buscar a aplicação pelo ID
    const application = await db.application.findUnique({
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
    // if (userData?.id !== application.submitterId && userData?.role !== "ADMIN") {
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
    
    // Verificar autenticação via cookie
    const userData = await getUserFromCookie();
    if (!userData?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar a aplicação para verificar permissão
    const existingApplication = await db.application.findUnique({
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
    if (userData.id !== existingApplication.submitterId && userData.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta aplicação" },
        { status: 403 }
      );
    }
    
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Atualizar a aplicação
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        url: body.url,
        status: body.status,
        // Apenas permitir atualizar o revisor se for administrador
        ...(userData.role === "ADMIN" && body.reviewerId
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
    
    // Verificar autenticação via cookie
    const userData = await getUserFromCookie();
    if (!userData?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar a aplicação para verificar permissão
    const existingApplication = await db.application.findUnique({
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
    if (userData.id !== existingApplication.submitterId && userData.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta aplicação" },
        { status: 403 }
      );
    }
    
    // Excluir a aplicação
    await db.application.delete({
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