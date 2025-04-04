import { NextResponse } from "next/server";

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

    // Validação básica dos campos
    const { email, name, password, role = 'standard' } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "Dados incompletos. Preencha todos os campos." },
        { status: 400 }
      );
    }

    // Validação do tipo de usuário
    const validRoles = ['standard', 'expert', 'business'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Tipo de usuário inválido. Escolha entre: standard, expert ou business." },
        { status: 400 }
      );
    }

    console.log("Usuário registado com sucesso (simulação):", { name, email, role });

    // Sempre retorna sucesso (simulação)
    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso!",
        user: {
          id: "simulated-id-" + Date.now(),
          name,
          email,
          role,
          createdAt: new Date(),
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 