import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Verificar se a requisição é JSON
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Content-Type inválido:", contentType);
      return NextResponse.json(
        { message: "O Content-Type deve ser application/json" },
        { status: 400 }
      );
    }

    // Parsing do corpo da requisição
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Erro ao fazer parse do JSON:", error);
      return NextResponse.json(
        { message: "Formato JSON inválido" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e password são obrigatórios" },
        { status: 400 }
      );
    }

    // Encontrar o utilizador pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Email ou password incorretos" },
        { status: 401 }
      );
    }

    // Verificar a password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email ou password incorretos" },
        { status: 401 }
      );
    }

    // Remover a password do objeto retornado
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Login bem-sucedido",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Erro no login:", error);
    
    return NextResponse.json(
      { 
        message: "Erro interno do servidor",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 