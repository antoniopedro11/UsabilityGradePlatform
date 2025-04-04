"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Função para limpar dados e navegar para o login
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Botão de entrar clicado - limpando storage");
    // Limpar dados de sessão antes de navegar
    localStorage.clear();
    sessionStorage.clear();
    
    // Navegar para login
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <Logo size="md" variant="white" showTagline={false} />
            </div>
            <div className="flex space-x-4 items-center">
              <ThemeButton />
              <Button asChild variant="default" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/register?new=true">Registar</Link>
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={handleLoginClick}>
                Entrar
              </Button>
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Avalie e melhore a experiência dos seus utilizadores
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg">
              A plataforma completa de avaliação de usabilidade e acessibilidade para aplicações web e móveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/register?new=true">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="#features">Saiba mais</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-96">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
                <div className="absolute top-0 left-0 right-0 h-12 bg-white/5 border-b border-white/10 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="mt-14 px-6 flex flex-col items-center justify-center">
                  {/* Logo ilustrativo para avaliação de usabilidade */}
                  <div className="w-32 h-32 mb-6 relative">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle cx="100" cy="100" r="90" fill="#4f46e5" fillOpacity="0.2" />
                      <circle cx="100" cy="100" r="60" fill="#4f46e5" fillOpacity="0.3" />
                      <path d="M60,100 A40,40 0 0,1 140,100" stroke="white" strokeWidth="4" fill="none" />
                      <path d="M65,80 A35,35 0 0,1 135,80" stroke="white" strokeWidth="4" fill="none" />
                      <path d="M75,125 A25,25 0 0,0 125,125" stroke="white" strokeWidth="4" fill="none" />
                      <circle cx="70" cy="85" r="5" fill="white" />
                      <circle cx="130" cy="85" r="5" fill="white" />
                      <path d="M70,135 L130,135" stroke="white" strokeWidth="2" strokeDasharray="4" />
                      <path d="M100,65 L100,135" stroke="white" strokeWidth="2" strokeDasharray="4" />
                    </svg>
                  </div>
                  <div className="text-white text-center font-medium mb-3">UsabilityGrade Platform</div>
                  <div className="h-8 bg-white/10 rounded-md w-full mb-4"></div>
                  <div className="h-20 bg-white/10 rounded-md w-full mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="h-16 bg-white/10 rounded-md"></div>
                    <div className="h-16 bg-white/10 rounded-md"></div>
                  </div>
                  <div className="mt-4 h-6 w-32 bg-blue-500/80 rounded-md mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Versão simplificada */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Soluções completas para avaliação de usabilidade</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              A nossa plataforma oferece todas as ferramentas necessárias para avaliar e melhorar a experiência do utilizador.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para melhorar a usabilidade do seu produto?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que estão a melhorar a experiência do utilizador com a UsabilityGrade Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-medium">
              <Link href="/register?new=true">Criar conta gratuita</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link href="/contact">Falar com especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
