import { NextResponse } from "next/server";
import { userDB } from "@/lib/db";
import { isResetCodeValid } from "@/lib/crypto";

// Estender o tipo User para incluir os campos de reset de senha
type UserWithResetCode = {
  id: string;
  email: string;
  resetCode?: string | null;
  resetCodeExpiry?: Date | null;
  [key: string]: any;
};

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

    // Validação dos campos
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email e código são obrigatórios." },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await userDB.findByEmail(email) as UserWithResetCode;

    // Se não encontrar o usuário ou o código não corresponder
    if (!user || user.resetCode !== code) {
      return NextResponse.json(
        { valid: false, message: "Código de recuperação inválido." },
        { status: 400 }
      );
    }

    // Verificar se o código ainda é válido (não expirou)
    const resetCodeExpiry = user.resetCodeExpiry || null;
    if (!isResetCodeValid(resetCodeExpiry)) {
      await userDB.invalidateResetCode(user.id);
      return NextResponse.json(
        { valid: false, message: "Código de recuperação expirado." },
        { status: 400 }
      );
    }

    // Código válido
    return NextResponse.json(
      { 
        valid: true, 
        message: "Código de recuperação válido.",
        userId: user.id
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao verificar código de recuperação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 