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

    // Validação do campo de email
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório para recuperação de senha." },
        { status: 400 }
      );
    }

    // Simulação de verificação do email no banco de dados
    // Em um cenário real, verificaria se o email existe na base de dados
    // e enviaria um email com um link/token para redefinição de senha
    
    console.log("Solicitação de recuperação de senha recebida para:", email);

    // Sempre retorna sucesso (simulação)
    return NextResponse.json(
      { 
        success: true,
        message: "Se o email estiver cadastrado em nosso sistema, enviaremos um link para recuperação de senha em alguns minutos."
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao processar recuperação de senha:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
} 