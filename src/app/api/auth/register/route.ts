import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("API de Registro: Iniciando registro de usuário");
  
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    const { name, email, password } = data;
    
    console.log("API de Registro: Dados recebidos:", { 
      name, 
      email, 
      passwordProvided: !!password 
    });

    // Validar dados obrigatórios
    if (!email || !password) {
      console.log("API de Registro: Dados incompletos");
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("API de Registro: Email já em uso:", email);
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        name: name || email.split("@")[0], // Usar parte do email como nome se não fornecido
        email,
        password: hashedPassword,
        role: "USER", // Papel padrão
      }
    });
    
    console.log("API de Registro: Usuário criado com sucesso:", {
      id: newUser.id,
      email: newUser.email
    });

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: "Usuário registrado com sucesso",
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 