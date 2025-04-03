import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";

export default function Home() {
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
              <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Link href="/login">Entrar</Link>
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
                <Link href="/register">Começar agora</Link>
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Soluções completas para avaliação de usabilidade</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              A nossa plataforma oferece todas as ferramentas necessárias para avaliar e melhorar a experiência do utilizador.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Avaliação de Usabilidade</h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Utilize checklists personalizados para avaliar a usabilidade da sua aplicação com base em critérios comprovados.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-400">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Critérios personalizados
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Avaliações colaborativas
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Relatórios detalhados
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z M8 12h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Acessibilidade WCAG</h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Garanta que a sua aplicação atenda aos padrões de acessibilidade WCAG e seja utilizável por todos.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-400">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Conformidade WCAG 2.1
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Validação automática
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sugestões de melhorias
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Análise de Dados</h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                Obtenha insights valiosos com relatórios detalhados e métricas de desempenho.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-400">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Relatórios exportáveis
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Painéis personalizáveis
          </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Comparação de resultados
          </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Link href="/register">Comece gratuitamente</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Empresas que confiam em nós</h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Veja o que os nossos clientes estão a dizer sobre a UsabilityGrade Platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="mr-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Maria Silva</h4>
                  <p className="text-gray-600 dark:text-gray-400">Designer UX, Soluções Tecnológicas</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "A UsabilityGrade Platform revolucionou a nossa forma de avaliar interfaces. Agora conseguimos identificar problemas muito mais rápido."
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="mr-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">João Pereira</h4>
                  <p className="text-gray-600 dark:text-gray-400">CTO, Startup Digital</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Os relatórios detalhados ajudaram-nos a melhorar significativamente a experiência do utilizador na nossa aplicação. Recomendo fortemente!"
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="mr-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Ana Costa</h4>
                  <p className="text-gray-600 dark:text-gray-400">Product Owner, Grupo Inovação</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Conseguimos aumentar a nossa conformidade com WCAG em 85% utilizando a plataforma. O suporte para acessibilidade é excelente."
              </p>
            </div>
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
              <Link href="/register">Criar conta gratuita</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link href="/contact">Falar com especialista</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Logo variant="white" size="sm" />
              </div>
              <p className="mb-6">
                Plataforma completa para avaliação de usabilidade e acessibilidade de aplicações web e móveis.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Recursos</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">Casos de uso</a></li>
                <li><a href="#" className="hover:text-white">Avaliações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Termos de serviço</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Licenças</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} UsabilityGrade Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Indicador visual de modo escuro - apenas para depuração */}
      <div className="dark-mode-indicator" id="theme-indicator" style={{ display: 'none' }}>
        MODO ESCURO ATIVO
      </div>
      
      {/* Script para atualizar o indicador */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Apenas para depuração de tema
        function updateThemeIndicator() {
          const indicator = document.getElementById('theme-indicator');
          if (indicator) {
            const isDark = document.documentElement.classList.contains('dark');
            indicator.style.display = isDark ? 'block' : 'none';
            console.log("Theme indicator updated:", isDark ? "visible" : "hidden");
          }
        }
        
        // Verificar inicialmente
        updateThemeIndicator();
        
        // Verificar a cada 1 segundo
        setInterval(updateThemeIndicator, 1000);
      `}} />
    </div>
  );
}
