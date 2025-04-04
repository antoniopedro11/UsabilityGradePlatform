import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    console.log("API: Recebendo solicitação de verificação de autenticação");
    
    // Obter os cookies - com await para resolver a Promise
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      console.log("API: Cookie de autenticação não encontrado");
      return NextResponse.json(
        { 
          isAuthenticated: false, 
          message: "Não autenticado - cookie não encontrado" 
        },
        { status: 401 }
      );
    }
    
    // Tentar analisar os dados do usuário
    try {
      const userData = JSON.parse(userDataCookie.value);
      console.log("API: Dados do usuário obtidos do cookie:", userData);
      
      // Verificar se temos os campos necessários
      if (!userData.id || !userData.email) {
        console.log("API: Dados de usuário inválidos no cookie");
        return NextResponse.json(
          { 
            isAuthenticated: false, 
            message: "Dados de usuário inválidos" 
          },
          { status: 401 }
        );
      }
      
      // Verificar o campo role
      const userRole = userData.role || "user";
      const isAdmin = userRole.toLowerCase() === "admin" || userRole.toUpperCase() === "ADMIN";
      
      console.log(`API: Usuário ${userData.email} autenticado, Role: ${userRole}, É admin: ${isAdmin}`);
      
      // Retornar informações de autenticação
      return NextResponse.json(
        { 
          isAuthenticated: true, 
          message: "Autenticação válida",
          user: {
            id: userData.id,
            name: userData.name || "Usuário",
            email: userData.email,
            role: userRole,
            isAdmin: isAdmin
          }
        },
        { 
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            "Surrogate-Control": "no-store"
          }
        }
      );
    } catch (error) {
      console.error("API: Erro ao analisar dados do usuário do cookie:", error);
      return NextResponse.json(
        { 
          isAuthenticated: false, 
          message: "Dados de usuário inválidos no cookie" 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("API: Erro ao verificar autenticação:", error);
    return NextResponse.json(
      { 
        isAuthenticated: false, 
        message: "Erro interno ao verificar autenticação" 
      },
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