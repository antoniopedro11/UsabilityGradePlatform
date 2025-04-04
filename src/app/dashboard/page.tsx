"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeButton } from "@/components/theme-button";
import { 
  PlusCircle, 
  Calendar,
  Activity
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats] = useState({
    projects: 3,
    evaluations: 8,
    tasks: 12,
    completedTasks: 5
  });
  
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar carregamento
  const [authError, setAuthError] = useState<string | null>(null); // Estado para erros de autenticação

  // Função para verificar autenticação
  const checkAuthentication = async () => {
    try {
      console.log("Verificando autenticação no Dashboard...");
      setIsLoading(true); // Iniciar o carregamento
      
      // Verificar expiração da sessão 
      const sessionExpiry = sessionStorage.getItem("sessionExpiry");
      if (sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry, 10);
        const currentTime = new Date().getTime();
        
        if (currentTime > expiryTime) {
          console.log("Sessão expirada pelo tempo limite:", currentTime - expiryTime, "ms depois do limite");
          throw new Error("Sessão expirada");
        }
      }
      
      // Verificar se há dados de usuário no localStorage
      const userData = localStorage.getItem("userData");
      
      if (!userData) {
        // Não há dados de usuário, redirecionar para login
        console.log("Usuário não autenticado (sem dados no storage), redirecionando para login...");
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
        return;
      }
      
      // Verificar se os dados são válidos
      try {
        const parsedUser = JSON.parse(userData);
        
        // Definir o usuário com os dados do localStorage enquanto verificamos no servidor
        setUser(parsedUser);
        
        // Armazenar os dados do usuário em um cookie para que o middleware possa acessá-los
        document.cookie = `userData=${encodeURIComponent(userData)}; path=/; max-age=86400`;
        console.log("Cookie de autenticação atualizado para", parsedUser.email);
        
        // Verificar se é necessário forçar reautenticação
        if (parsedUser.forceReauth) {
          const lastLogin = parsedUser.lastLogin || 0;
          const currentTime = new Date().getTime();
          const SESSION_MAX_TIME = 30 * 60 * 1000; // 30 minutos em milissegundos
          
          if (currentTime - new Date(lastLogin).getTime() > SESSION_MAX_TIME) {
            console.log("Sessão expirada por tempo máximo:", currentTime - new Date(lastLogin).getTime(), "ms passados desde o login");
            throw new Error("Sessão expirada, necessário reautenticação");
          }
        }
        
        // Finalizar o carregamento já que temos os dados do usuário do localStorage
        setIsLoading(false);
        
        // Tentar verificar a autenticação com o servidor, mas não bloquear a renderização
        console.log("Enviando solicitação de verificação ao servidor...");
        fetch("/api/check-auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${new Date().getTime()}` // Token temporário simulado
          },
          cache: "no-store"
        })
        .then(response => {
          if (!response.ok) {
            console.warn("Verificação de autenticação com o servidor falhou, mas usando dados locais");
          } else {
            console.log("Autenticação no servidor confirmada");
          }
        })
        .catch(error => {
          console.warn("Erro ao verificar com o servidor, continuando com dados locais:", error);
        });
        
      } catch (error) {
        // Erro ao processar dados do usuário
        console.error("Erro ao verificar autenticação:", error);
        setAuthError("Falha na autenticação. Redirecionando...");
        
        // Atraso antes de redirecionar para mostrar mensagem de erro
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login?expired=true";
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setAuthError("Erro ao verificar sessão. Redirecionando...");
      
      // Atraso antes de redirecionar para mostrar mensagem de erro
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login?expired=true";
      }, 1500);
    }
  };

  // Simples carregamento de usuário com redirecionamento se não estiver autenticado
  useEffect(() => {
    // Executar verificação de autenticação
    checkAuthentication();
  }, []);

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-white mb-4"></div>
          <p className="text-lg font-medium text-gray-800 dark:text-white">
            Carregando dashboard...
          </p>
          {authError && (
            <p className="mt-2 text-red-600 dark:text-red-400">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  // Resto do componente (o conteúdo do dashboard)
  return (
    <div className="p-6">
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bem-vindo ao painel de controle, {user?.name}!
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <PlusCircle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.projects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <Activity className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avaliações</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.evaluations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarefas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.tasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarefas Concluídas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de atividades recentes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Avaliação de Usabilidade concluída</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Há 2 horas</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Novo projeto criado: Portal de Vendas</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ontem às 14:30</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">3 tarefas concluídas no Projeto App Mobile</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Há 2 dias</p>
          </div>
        </div>
      </div>

      {/* Projetos recentes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projetos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progresso</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Portal de Vendas</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">22/03/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">App Mobile</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    Em revisão
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">15/02/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Website Corporativo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Concluído
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">05/01/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}