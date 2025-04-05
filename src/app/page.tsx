"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useRouter } from "next/navigation";
import { CheckCircle2, BarChart3, Users, PenTool, Layers, Puzzle, Star, Award, Clock, Shield } from "lucide-react";

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
      <header className="bg-gradient-to-r from-black to-gray-900 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <Logo size="md" variant="white" showTagline={false} />
            </div>
            <div className="flex space-x-4 items-center">
              <LanguageToggle />
              <ThemeButton />
              <Button asChild variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/register?new=true">Registar</Link>
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10 hover:text-orange-400" onClick={handleLoginClick}>
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
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              A plataforma completa de avaliação de usabilidade e acessibilidade para aplicações web e móveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/register?new=true">Começar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="#features">Saiba mais</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-96">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
                <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 border-b border-white/10 flex items-center px-4">
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
                      <circle cx="100" cy="100" r="90" fill="#000000" fillOpacity="0.2" />
                      <circle cx="100" cy="100" r="60" fill="#000000" fillOpacity="0.3" />
                      <path d="M60,100 A40,40 0 0,1 140,100" stroke="#f97316" strokeWidth="4" fill="none" />
                      <path d="M65,80 A35,35 0 0,1 135,80" stroke="#f97316" strokeWidth="4" fill="none" />
                      <path d="M75,125 A25,25 0 0,0 125,125" stroke="#f97316" strokeWidth="4" fill="none" />
                      <circle cx="70" cy="85" r="5" fill="#f97316" />
                      <circle cx="130" cy="85" r="5" fill="#f97316" />
                      <path d="M70,135 L130,135" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
                      <path d="M100,65 L100,135" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
                    </svg>
                  </div>
                  <div className="text-white text-center font-medium mb-3">UsabilityGrade Platform</div>
                  <div className="h-8 bg-white/10 rounded-md w-full mb-4"></div>
                  <div className="h-20 bg-white/10 rounded-md w-full mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="h-16 bg-white/10 rounded-md"></div>
                    <div className="h-16 bg-white/10 rounded-md"></div>
                  </div>
                  <div className="mt-4 h-6 w-32 bg-orange-500/80 rounded-md mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* O que é section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">O que é o UsabilityGrade Platform?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Uma plataforma completa para avaliar, medir e melhorar a experiência do utilizador em produtos digitais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-black p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Avaliações de Usabilidade</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Realize avaliações de usabilidade sistemáticas utilizando checklists e critérios padronizados baseados em normas internacionais.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-black p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <BarChart3 size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Relatórios e Métricas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Obtenha insights detalhados através de relatórios quantitativos e qualitativos sobre a experiência do utilizador no seu produto.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-black p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Colaboração em Equipa</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Colabore com a sua equipa em projetos de avaliação, distribua tarefas e acompanhe o progresso em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Funcionalidades Principais</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Ferramentas completas para avaliar, medir e melhorar a experiência do utilizador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <PenTool size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Checklists Personalizáveis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie e personalize checklists de avaliação com critérios específicos para o seu produto. Utilize modelos predefinidos ou crie do zero.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Gestão de Projetos</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize avaliações em projetos, atribua tarefas a membros da equipa e acompanhe o progresso de cada avaliação.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Puzzle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Templates Reutilizáveis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Acesse e utilize templates baseados em padrões internacionais como ISO 9241, WCAG e heurísticas de Nielsen.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Análise Detalhada</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Obtenha métricas e gráficos detalhados sobre a usabilidade do seu produto, com pontuações por categoria e critério.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Casos de Uso</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Como o UsabilityGrade Platform é utilizado por diferentes equipas e organizações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-black rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-3 bg-orange-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Equipas de UX/UI</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Avalie protótipos e produtos existentes para identificar problemas de usabilidade antes do lançamento.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Testes de usabilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Avaliações heurísticas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Validação de protótipos</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-black rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-3 bg-orange-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Empresas de Desenvolvimento</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Integre avaliações de usabilidade no ciclo de desenvolvimento para garantir qualidade constante.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Testes de aceitação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Auditorias de usabilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Verificação de padrões</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-black rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-3 bg-orange-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Consultores de UX</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Ofereça relatórios profissionais de avaliação a clientes com recomendações claras para melhorias.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Relatórios de consultoria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Benchmarking competitivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Recomendações de melhorias</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Benefícios da Plataforma</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Por que escolher o UsabilityGrade Platform para avaliar a experiência dos seus utilizadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <Star size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Qualidade Superior</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Melhore significativamente a qualidade dos seus produtos digitais através de avaliações sistemáticas.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <Award size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Padrões Internacionais</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Baseado em padrões internacionais de usabilidade e acessibilidade como ISO 9241 e WCAG.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Eficiência no Processo</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reduza o tempo de avaliação com templates e checklists pré-definidos e recomendações automatizadas.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-orange-500 dark:text-orange-400 mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Decisões Baseadas em Dados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tome decisões de design e desenvolvimento baseadas em dados concretos e não em suposições.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mensagem de pronto para melhorar section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para melhorar a usabilidade do seu produto?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que estão a melhorar a experiência do utilizador com a UsabilityGrade Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
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
