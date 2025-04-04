import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Verificar se o usuário é administrador através do cookie
async function checkAdmin(request: NextRequest) {
  try {
    // Obter cookies
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");

    if (!userDataCookie || !userDataCookie.value) {
      console.log("API Admin: Cookie de autenticação não encontrado");
      return false;
    }

    // Analisar dados do usuário
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    console.log("API Admin: Dados do usuário obtidos do cookie:", userData);

    // Verificar se o usuário tem permissão de administrador
    const role = userData.role?.toString().toUpperCase() || "";
    const isAdmin = role === "ADMIN";

    console.log(`API Admin: Usuário: ${userData.email}, Role: ${role}, É admin? ${isAdmin}`);
    
    return isAdmin;
  } catch (error) {
    console.error("API Admin: Erro ao verificar permissões de administrador:", error);
    return false;
  }
}

// Endpoint GET para listar usuários
export async function GET(request: NextRequest) {
  console.log("API Admin: Iniciando requisição GET para usuários");
  
  try {
    // Verificar se é administrador
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      console.log("API Admin: Acesso negado - usuário não é administrador");
      return NextResponse.json(
        { error: "Acesso negado. Permissões de administrador são necessárias." },
        { status: 403 }
      );
    }

    // Obter parâmetros de consulta
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construir filtro de consulta
    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && ["ADMIN", "USER", "EVALUATOR"].includes(role.toUpperCase())) {
      whereClause.role = role.toUpperCase();
    }

    // Consultar total de usuários
    const totalUsers = await prisma.user.count({
      where: whereClause
    });

    // Consultar usuários paginados
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Não incluir a senha por segurança
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    console.log(`API Admin: ${users.length} usuários encontrados (total: ${totalUsers})`);

    // Retornar dados
    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error("API Admin: Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários" },
      { status: 500 }
    );
  }
}

// Endpoint PUT para atualizar um usuário
export async function PUT(request: NextRequest) {
  console.log("API Admin: Iniciando requisição PUT para usuários");
  
  try {
    // Verificar se é administrador
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      console.log("API Admin: Acesso negado - usuário não é administrador");
      return NextResponse.json(
        { error: "Acesso negado. Permissões de administrador são necessárias." },
        { status: 403 }
      );
    }

    // Obter dados da requisição
    const data = await request.json();
    const { id, name, email, role, password } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o e-mail já está em uso por outro usuário
    if (email && email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email }
      });

      if (emailInUse) {
        return NextResponse.json(
          { error: "E-mail já está em uso por outro usuário" },
          { status: 400 }
        );
      }
    }

    // Validar o papel (role)
    if (role && !["ADMIN", "USER", "EVALUATOR"].includes(role.toUpperCase())) {
      return NextResponse.json(
        { error: "Papel de usuário inválido. Deve ser ADMIN, USER ou EVALUATOR" },
        { status: 400 }
      );
    }

    // Se estiver promovendo a admin, registrar
    if (role?.toUpperCase() === "ADMIN" && existingUser.role !== "ADMIN") {
      console.log(`API Admin: Promovendo usuário ${existingUser.email} para ADMIN`);
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role.toUpperCase();

    // Se a senha foi fornecida, hasheá-la
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log(`API Admin: Usuário ${updatedUser.email} atualizado com sucesso`);

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser
    });
  } catch (error) {
    console.error("API Admin: Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// Endpoint DELETE para remover um usuário
export async function DELETE(request: NextRequest) {
  console.log("API Admin: Iniciando requisição DELETE para usuários");
  
  try {
    // Verificar se é administrador
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      console.log("API Admin: Acesso negado - usuário não é administrador");
      return NextResponse.json(
        { error: "Acesso negado. Permissões de administrador são necessárias." },
        { status: 403 }
      );
    }

    // Obter ID do usuário da URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Não permitir que o administrador exclua a si mesmo
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (userDataCookie) {
      const currentUser = JSON.parse(decodeURIComponent(userDataCookie.value));
      if (currentUser.id === id) {
        return NextResponse.json(
          { error: "Você não pode excluir sua própria conta" },
          { status: 400 }
        );
      }
    }

    // Excluir usuário
    await prisma.user.delete({
      where: { id }
    });

    console.log(`API Admin: Usuário ${existingUser.email} excluído com sucesso`);

    return NextResponse.json({
      message: "Usuário excluído com sucesso"
    });
  } catch (error) {
    console.error("API Admin: Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }
} 