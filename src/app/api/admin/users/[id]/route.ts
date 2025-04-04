import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Função para verificar se o usuário tem acesso de administrador
const checkAdminAccess = async (request: Request) => {
  const cookies = request.headers.get('cookie');
  if (!cookies) {
    return false;
  }
  
  const userDataCookie = cookies.split(';').find(c => c.trim().startsWith('userData='));
  if (!userDataCookie) {
    return false;
  }
  
  try {
    const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
    return userData.role === 'admin';
  } catch (error) {
    console.error('Erro ao verificar permissões de administrador:', error);
    return false;
  }
};

// Endpoint para atualizar usuário por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('API Admin Users: Atualizando usuário', params.id);
  
  // Verificar permissões de administrador
  const isAdmin = await checkAdminAccess(request);
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Acesso negado: permissões de administrador necessárias" },
      { status: 403 }
    );
  }
  
  try {
    const userId = params.id;
    
    // Verificar se o ID é válido
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Validar dados
    if (!data.name || !data.email || !data.role) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar se o novo email já está em uso por outro usuário
    if (data.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (emailInUse && emailInUse.id !== userId) {
        return NextResponse.json(
          { error: "Email já está em uso por outro usuário" },
          { status: 400 }
        );
      }
    }
    
    // Converter o role para o formato esperado pelo Prisma (enum)
    const roleMap: Record<string, any> = {
      'admin': 'ADMIN',
      'standard': 'USER',
      'expert': 'EVALUATOR',
      'business': 'USER' // Mapear 'business' para 'USER' no banco
    };
    
    // Registrar promoção a administrador
    const isPromotedToAdmin = data.role === 'admin' && existingUser.role !== 'ADMIN';
    if (isPromotedToAdmin) {
      console.log(`PROMOÇÃO: Usuário ${existingUser.email} promovido a administrador`);
    }
    
    // Atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        role: roleMap[data.role] || 'USER'
      }
    });
    
    return NextResponse.json({
      message: isPromotedToAdmin 
        ? "Usuário promovido a administrador com sucesso" 
        : "Usuário atualizado com sucesso",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.toLowerCase(),
        createdAt: updatedUser.createdAt.toISOString()
      }
    });
    
  } catch (error) {
    console.error('API Admin Users: Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para excluir usuário por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('API Admin Users: Excluindo usuário', params.id);
  
  // Verificar permissões de administrador
  const isAdmin = await checkAdminAccess(request);
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Acesso negado: permissões de administrador necessárias" },
      { status: 403 }
    );
  }
  
  try {
    const userId = params.id;
    
    // Verificar se o ID é válido
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    // Excluir o usuário
    await prisma.user.delete({
      where: { id: userId }
    });
    
    return NextResponse.json({
      message: "Usuário excluído com sucesso",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role.toLowerCase(),
        createdAt: existingUser.createdAt.toISOString()
      }
    });
    
  } catch (error) {
    console.error('API Admin Users: Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 