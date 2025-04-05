import { NextResponse } from "next/server";
import { userDB } from "@/lib/db";
import { generateResetCode, getResetCodeExpiry } from "@/lib/crypto";

export async function POST(request: Request) {
  try {
    // Verificar se a requisição é JSON
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
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
      return NextResponse.json(
        { message: "Formato JSON inválido" },
        { status: 400 }
      );
    }

    // Validação do campo de email
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório para recuperação de senha." },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await userDB.findByEmail(email);

    // Se não encontrar o usuário, ainda retornar sucesso por segurança
    if (!user) {
      console.log(`Tentativa de recuperação de senha para email não encontrado: ${email}`);
      return NextResponse.json(
        { success: true, message: "Se o email estiver cadastrado, enviaremos um código de recuperação." },
        { status: 200 }
      );
    }

    // Gerar código de 6 dígitos para recuperação
    const resetCode = generateResetCode(6);
    
    // Definir expiração para 30 minutos
    const resetCodeExpiry = getResetCodeExpiry(30);

    // Salvar código no banco de dados
    await userDB.createResetCode(email, resetCode, resetCodeExpiry);

    console.log(`Código de recuperação para ${email}: ${resetCode} (válido até ${resetCodeExpiry})`);

    // Retornar o código para o cliente APENAS em ambiente de desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { 
          success: true, 
          message: "Código de recuperação gerado com sucesso.",
          // Incluir resetCode apenas em desenvolvimento
          resetCode,
          expiresAt: resetCodeExpiry
        },
        { status: 200 }
      );
    }

    // Em produção, não retornar o código
    return NextResponse.json(
      { 
        success: true, 
        message: "Se o email estiver cadastrado, enviaremos um código de recuperação."
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao processar solicitação de recuperação de senha:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 