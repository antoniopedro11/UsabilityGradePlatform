import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("Endpoint de registro acionado");
  try {
    // Verificar se a requisição é JSON
    const contentType = request.headers.get("content-type");
    console.log("Content-Type recebido:", contentType);
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
      console.log("Body recebido:", JSON.stringify(body));
    } catch (error) {
      console.error("Erro ao fazer parse do JSON:", error);
      return NextResponse.json(
        { message: "Formato JSON inválido" },
        { status: 400 }
      );
    }

    // Validação dos campos
    const { email, name, password } = body;
    console.log("Campos extraídos - email:", email, "name:", name, "password:", password ? "***" : undefined);

    if (!email || !name || !password) {
      console.error("Campos obrigatórios ausentes");
      return NextResponse.json(
        { message: "Dados incompletos. Preencha todos os campos." },
        { status: 400 }
      );
    }

    // Verificar se o email tem formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Formato de email inválido:", email);
      return NextResponse.json(
        { message: "O formato do e-mail é inválido." },
        { status: 400 }
      );
    }

    // Verificar se a senha tem pelo menos 8 caracteres
    if (password.length < 8) {
      console.error("Senha muito curta");
      return NextResponse.json(
        { message: "A palavra-passe deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    try {
      console.log("Verificando se o email já existe:", email);
      // Verificar se o email já está registrado
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.error("Email já registrado:", email);
        return NextResponse.json(
          { message: "Este email já está em uso." },
          { status: 400 }
        );
      }

      console.log("Gerando hash da senha");
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hash gerado com sucesso");

      console.log("Criando usuário no banco de dados");
      // Criar o usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      console.log("Usuário criado com sucesso:", user.id);

      // Remover a senha do objeto retornado
      const { password: _, ...userWithoutPassword } = user;

      console.log("Retornando resposta de sucesso");
      return NextResponse.json(
        { 
          message: "Usuário criado com sucesso!",
          user: userWithoutPassword,
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Verificar se é um erro do Prisma
      if (error?.code) {
        console.error("Erro do Prisma:", error.code, error.message);
        
        // Códigos de erro comuns do Prisma
        if (error.code === 'P2002') {
          return NextResponse.json(
            { message: "Este email já está em uso." },
            { status: 400 }
          );
        }
      }
      
      console.error("Erro específico:", error);
      throw error; // Re-throw para ser capturado pelo catch externo
    }
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { 
        message: "Erro interno do servidor.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 