import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Definir quais rotas são consideradas públicas
  const isPublicPath = path === "/" || 
                       path === "/login" || 
                       path === "/register" || 
                       path.startsWith("/api/auth") ||
                       path === "/api/register" ||
                       path === "/api/login";

  // Obter o token para verificar se o usuário está autenticado
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirecionar usuários não autenticados para login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirecionar usuários autenticados que tentam acessar login/registro
  if ((path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas, exceto:
     * 1. Todas as rotas que começam com /api (APIs)
     * 2. Todas as rotas que comecem com /_next (arquivos estáticos da Next)
     * 3. Todas as rotas que comecem com /public (imagens públicas, etc.)
     * 4. Todas as rotas que terminam com extensões de arquivos
     */
    "/((?!api|_next|public|.*\\..*).*)",
  ],
}; 