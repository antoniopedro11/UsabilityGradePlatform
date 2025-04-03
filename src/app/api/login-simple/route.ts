import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("API: Recebendo solicitação de login");
  
  // Verificar o tipo de conteúdo
  const contentType = request.headers.get("content-type");
  console.log("Content-Type:", contentType);
  
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Erro: Content-Type inválido");
    return NextResponse.json(
      { success: false, message: "Content-Type deve ser application/json" },
      { status: 400 }
    );
  }

  try {
    // Obter dados do corpo da requisição
    const body = await request.json();
    console.log("Dados recebidos:", { email: body.email, password: "******" });

    // Validar se email e senha foram fornecidos
    if (!body.email) {
      console.error("Erro: Email não fornecido");
      return NextResponse.json(
        { success: false, message: "Email é obrigatório" },
        { status: 400 }
      );
    }

    if (!body.password) {
      console.error("Erro: Senha não fornecida");
      return NextResponse.json(
        { success: false, message: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    // Simulação de login bem-sucedido (em uma implementação real, verificaríamos credenciais no banco de dados)
    console.log("Login bem-sucedido para:", body.email);
    
    // Criar um objeto de usuário consistente
    const user = {
      id: "user_" + Math.random().toString(36).substring(2, 11),
      name: "Usuário " + body.email.split("@")[0],
      email: body.email,
      createdAt: new Date().toISOString()
    };
    
    console.log("Retornando usuário:", user);

    // Retornar resposta de sucesso com objeto de usuário
    return NextResponse.json(
      { 
        success: true, 
        message: "Login realizado com sucesso",
        user: user
      },
      { 
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
  } catch (error) {
    // Lidar com erros no processo
    console.error("Erro ao processar login:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor ao processar login" },
      { status: 500 }
    );
  }
} 