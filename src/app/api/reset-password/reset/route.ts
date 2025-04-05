import { NextResponse } from "next/server";
import { userDB } from "@/lib/db";
import { hashPassword, isResetCodeValid } from "@/lib/crypto";

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
    const { userId, code, password } = body;

    if (!userId || !code || !password) {
      return NextResponse.json(
        { message: "ID do usuário, código e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Validar a força da senha
    if (password.length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Buscar usuário pelo ID
    const user = await userDB.findById(userId) as UserWithResetCode;

    // Se não encontrar o usuário ou o código não corresponder
    if (!user || user.resetCode !== code) {
      return NextResponse.json(
        { success: false, message: "Código de recuperação inválido." },
        { status: 400 }
      );
    }

    // Verificar se o código ainda é válido (não expirou)
    const resetCodeExpiry = user.resetCodeExpiry || null;
    if (!isResetCodeValid(resetCodeExpiry)) {
      await userDB.invalidateResetCode(user.id);
      return NextResponse.json(
        { success: false, message: "Código de recuperação expirado." },
        { status: 400 }
      );
    }

    // Gerar hash da nova senha
    const hashedPassword = hashPassword(password);

    // Atualizar a senha e limpar código de recuperação
    await userDB.resetPassword(userId, hashedPassword);

    // Senha atualizada com sucesso
    return NextResponse.json(
      { 
        success: true, 
        message: "Senha redefinida com sucesso."
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 