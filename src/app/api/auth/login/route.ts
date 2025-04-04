import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("API: Login - Recebendo solicitação");
    
    // Extrair dados do corpo da requisição
    const body = await request.json();
    const { email, password } = body;
    
    console.log(`API: Login - Tentativa para o e-mail: ${email}`);
    
    if (!email || !password) {
      console.log("API: Login - E-mail ou senha não fornecidos");
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }
    
    // Verificar usuário no banco de dados
    let user;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      
      if (!dbUser) {
        console.log("API: Login - Usuário não encontrado no banco de dados");
        return NextResponse.json(
          { error: "E-mail ou senha incorretos" },
          { status: 401 }
        );
      }
      
      console.log(`API: Login - Usuário encontrado no banco de dados: ${dbUser.email}, role: ${dbUser.role}`);
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, dbUser.password || "");
      
      if (!isPasswordValid) {
        console.log("API: Login - Senha inválida para usuário do banco de dados");
        return NextResponse.json(
          { error: "E-mail ou senha incorretos" },
          { status: 401 }
        );
      }
      
      console.log("API: Login - Senha válida para usuário do banco de dados");
      
      user = {
        id: dbUser.id,
        name: dbUser.name || "Usuário",
        email: dbUser.email,
        role: dbUser.role || "USER", // Valor padrão caso não tenha role
        createdAt: dbUser.createdAt.toISOString()
      };
    } catch (dbError) {
      console.error("API: Login - Erro ao consultar o banco de dados:", dbError);
      return NextResponse.json(
        { error: "Erro ao verificar credenciais. Tente novamente mais tarde." },
        { status: 500 }
      );
    }
    
    // Garantir que o campo role está adequadamente definido
    const finalRole = user.role || "USER";
    const normalizedRole = typeof finalRole === 'string' 
      ? finalRole.toUpperCase() === "ADMIN" ? "ADMIN" : "USER"
      : "USER";
    
    console.log(`API: Login - Role final do usuário: ${normalizedRole}`);
    
    // Formatar resposta
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizedRole,
      createdAt: user.createdAt
    };
    
    console.log("API: Login - Login bem-sucedido, retornando dados do usuário:", userResponse);
    
    // Retornar resposta bem-sucedida
    return NextResponse.json(
      { 
        message: "Login bem-sucedido", 
        user: userResponse
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API: Login - Erro geral:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o login" },
      { status: 500 }
    );
  }
} 