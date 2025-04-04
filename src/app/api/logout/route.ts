import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Em uma implementação real, você invalidaria o token JWT ou removeria a sessão do banco de dados
    
    // Retornar resposta de sucesso com headers apropriados
    return NextResponse.json(
      { 
        success: true, 
        message: "Logout realizado com sucesso"
      },
      { 
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store",
          "Clear-Site-Data": '"cookies", "storage"'
        }
      }
    );
  } catch (error) {
    console.error("Erro ao processar logout:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao processar logout" },
      { 
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
  }
} 