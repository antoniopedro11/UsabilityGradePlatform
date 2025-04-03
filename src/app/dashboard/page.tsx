"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { 
  BarChart3, 
  ClipboardCheck, 
  LayoutDashboard, 
  ListChecks, 
  LogOut, 
  Settings, 
  User, 
  Menu,
  PlusCircle, 
  Calendar,
  Activity,
  X
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats] = useState({
    projects: 3,
    evaluations: 8,
    tasks: 12,
    completedTasks: 5
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simples carregamento de usuário sem redirecionamentos
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  }, []);

  // Função simples de logout
  const handleSignOut = () => {
    localStorage.removeItem("user");
    document.location.href = "/login";
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClick = () => setMobileMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mobileMenuOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - versão desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-30">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-center">
          <Link href="/dashboard">
            <div className="flex items-center">
              <Logo size="md" showTagline={false} />
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/projects" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ClipboardCheck className="mr-3 h-5 w-5" />
              Projetos
            </Link>
            <Link href="/dashboard/evaluations" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BarChart3 className="mr-3 h-5 w-5" />
              Avaliações
            </Link>
            <Link href="/dashboard/tasks" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ListChecks className="mr-3 h-5 w-5" />
              Tarefas
            </Link>
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Configurações
              </h3>
              <div className="mt-2 space-y-1">
                <Link href="/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="mr-3 h-5 w-5" />
                  Perfil
                </Link>
                <Link href="/settings" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="mr-3 h-5 w-5" />
                  Configurações
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "exemplo@email.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center">
                  <Logo size="sm" showTagline={false} />
                </div>
              </Link>
              <button 
                className="p-2 rounded-md text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/projects" 
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ClipboardCheck className="mr-3 h-5 w-5" />
                  Projetos
                </Link>
                <Link 
                  href="/dashboard/evaluations" 
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Avaliações
                </Link>
                <Link 
                  href="/dashboard/tasks" 
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListChecks className="mr-3 h-5 w-5" />
                  Tarefas
                </Link>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Configurações
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      Perfil
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      Configurações
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sair
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="lg:pl-64 w-full">
        {/* Cabeçalho móvel */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(true);
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-2">
                <Logo size="sm" showTagline={false} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeButton />
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="p-4 lg:p-8">
          {/* Cabeçalho da página */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Olá, {user?.name?.split(' ')[0] || "Usuário"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bem-vindo(a) ao seu painel de usabilidade
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo projeto
              </Button>
            </div>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 bg-opacity-10 rounded-full p-3">
                  <ClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.projects}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Projetos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 bg-opacity-10 rounded-full p-3">
                  <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.evaluations}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avaliações</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 bg-opacity-10 rounded-full p-3">
                  <ListChecks className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tarefas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 bg-opacity-10 rounded-full p-3">
                  <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round((stats.completedTasks / stats.tasks) * 100) || 0}%
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tarefas Concluídas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seções principais - conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projetos recentes */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Projetos recentes</h2>
                <Link 
                  href="/dashboard/projects" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">Avaliação de E-commerce</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Análise de usabilidade da plataforma de comércio online</p>
                  <div className="flex items-center mt-2">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded">Em progresso</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">Última atualização: 2 dias atrás</p>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">Redesign de App Bancário</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avaliação heurística e testes com usuários</p>
                  <div className="flex items-center mt-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded">Pendente</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">Última atualização: 5 dias atrás</p>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">Portal Educacional</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avaliação do fluxo de acesso a materiais online</p>
                  <div className="flex items-center mt-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded">Concluído</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">Concluído: 1 semana atrás</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Atividades recentes e calendário */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Atividades recentes</h2>
                <Link 
                  href="/dashboard/activities" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ver todas
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-full p-2">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Avaliação agendada</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Amanhã às 14:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-2">
                    <ListChecks className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">2 tarefas concluídas</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hoje às 10:25</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/20 rounded-full p-2">
                    <ClipboardCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Novo projeto adicionado</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ontem às 18:42</p>
                  </div>
                </div>
              </div>
              
              {/* Mini calendário */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Próximos eventos</h3>
                  <Link 
                    href="/dashboard/calendar" 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Ver calendário
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">Reunião de equipe</div>
                    <div className="text-gray-500 dark:text-gray-400">Hoje</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">Teste com usuários</div>
                    <div className="text-gray-500 dark:text-gray-400">Amanhã</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">Apresentação de resultados</div>
                    <div className="text-gray-500 dark:text-gray-400">24/06</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}