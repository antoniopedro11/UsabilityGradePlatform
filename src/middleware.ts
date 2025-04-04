import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("Middleware: Processando requisição para", pathname);
  
  // Para fins de depuração, permitir acesso a todas as rotas sem autenticação
  console.log("Middleware: Ignorando verificação de autenticação para fins de teste");
  return NextResponse.next();
  
  // Obter o cookie de autenticação
  const userDataCookie = request.cookies.get("userData");
  
  // Verificar se o usuário está autenticado pelo cookie
  const isAuthenticated = userDataCookie && userDataCookie.value;
  
  console.log("Middleware: Status de autenticação:", isAuthenticated ? "Autenticado" : "Não autenticado");
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/api/auth/login",
    "/api/auth/register",
    "/api/check-auth",
    "/diagnose-auth", // Rota de diagnóstico
    "/knowledge",
    "/teste", // Nova rota de teste
    "/teste-aplicacoes", // Nova rota de teste
  ];

  // Rotas de API que devem ser sempre permitidas
  const apiRoutes = ["/api/"];
  
  // Verificar se a rota atual está na lista de rotas públicas
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/knowledge/")
  );
  
  // Verificar se é uma rota de API (para não bloquear chamadas de API)
  const isApiRoute = apiRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Se for uma rota pública, permitir acesso
  if (isPublicRoute) {
    console.log("Middleware: Rota pública, acesso permitido:", pathname);
    return NextResponse.next();
  }
  
  // Se for uma rota de API, permitir acesso para processamento pela própria API
  if (isApiRoute) {
    console.log("Middleware: Rota de API, acesso permitido:", pathname);
    return NextResponse.next();
  }
  
  // Se o usuário não estiver autenticado e a rota não for pública, redirecionar para o login
  if (!isAuthenticated) {
    console.log("Middleware: Usuário não autenticado, redirecionando para login");
    
    const url = new URL('/login', request.url);
    // Adicionar a URL de redirecionamento como parâmetro para voltar após o login
    url.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(url);
  }
  
  // Se chegou aqui, o usuário está autenticado
  try {
    // Tentar obter informações do usuário do cookie
    const userData = JSON.parse(userDataCookie!.value);
    const userRole = userData.role?.toLowerCase() || "user";
    
    console.log("Middleware: Usuário autenticado:", userData.email, "Role:", userRole);
    
    // Verificar rotas de admin
    if (pathname.startsWith("/admin")) {
      // Se não for admin, redirecionar para o dashboard
      if (userRole !== "admin" && userRole !== "ADMIN" && userRole !== "ADMIN".toLowerCase()) {
        console.log("Middleware: Acesso negado à área de admin para usuário:", userRole);
        
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Usuário autenticado e com permissões corretas, permitir acesso
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware: Erro ao processar autenticação:", error);
    
    // Em caso de erro no processamento do cookie, redirecionar para página de diagnóstico
    if (pathname !== "/diagnose-auth") {
      console.log("Middleware: Redirecionando para página de diagnóstico devido a erro");
      return NextResponse.redirect(new URL('/diagnose-auth', request.url));
    }
    
    // Se já estiver na página de diagnóstico, apenas permitir
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 