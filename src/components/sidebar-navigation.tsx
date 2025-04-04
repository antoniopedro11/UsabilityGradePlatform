"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Lock,
  Users, 
  BarChart2, 
  ClipboardList, 
  MessageSquare, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Menu,
  Briefcase,
  CheckSquare,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tipagem para usuário
interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
}

// Tipagem para item de navegação
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  public?: boolean;
  onClick?: () => void;
}

// Interface para as props do componente SidebarContent
interface SidebarContentProps {
  showLabels?: boolean;
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Verificar autenticação
  const isAuthenticated = !!userData;

  // Função de verificação de autenticação
  const checkAuth = async () => {
    try {
      // Verificar dados no localStorage primeiro
      if (typeof window !== "undefined") {
        const storedUserData = localStorage.getItem("userData");
        
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            
            // Verificar se o usuário é um administrador
            const role = parsedData.role?.toLowerCase() || "";
            setIsAdmin(role === "admin");
            console.log("Usuário autenticado via localStorage:", parsedData.email);
          } catch (error) {
            console.error("Erro ao analisar dados do usuário:", error);
            localStorage.removeItem("userData");
          }
        } else {
          // Se não houver dados no localStorage, tentar verificar via API
          const response = await fetch("/api/check-auth", {
            method: "GET",
            credentials: "include"
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.isAuthenticated) {
              setUserData(data.user);
              setIsAdmin(data.isAdmin);
              // Armazenar dados para futuras verificações
              localStorage.setItem("userData", JSON.stringify(data.user));
              console.log("Usuário autenticado via API:", data.user.email);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  // Links de navegação principal
  const mainNavItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      active: pathname === "/dashboard",
      public: false,
    },
    {
      name: "Projetos",
      href: "/dashboard/projects",
      icon: <Briefcase className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/projects"),
      public: false,
    },
    {
      name: "Tarefas",
      href: "/dashboard/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/tasks"),
      public: false,
    },
    {
      name: "Aplicações",
      href: "/applications",
      icon: <Laptop className="w-5 h-5" />,
      active: pathname.startsWith("/applications"),
      public: false,
    },
    {
      name: "Avaliações",
      href: "/dashboard/evaluations",
      icon: <ClipboardList className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/evaluations"),
      public: false,
    },
    {
      name: "Base de Conhecimento",
      href: "/knowledge",
      icon: <BookOpen className="w-5 h-5" />,
      active: pathname.startsWith("/knowledge"),
      public: true,
    },
    {
      name: "Fórum",
      href: "/forum",
      icon: <MessageSquare className="w-5 h-5" />,
      active: pathname.startsWith("/forum"),
      public: true,
    },
  ];

  // Links de administração (apenas para admins)
  const adminNavItems: NavItem[] = isAdmin ? [
    {
      name: "Painel Admin",
      href: "/admin",
      icon: <Lock className="w-5 h-5" />,
      active: pathname === "/admin",
    },
    {
      name: "Utilizadores",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      active: pathname ==="/admin/users",
    },
    {
      name: "Fórum - Categorias",
      href: "/admin/forum/categories",
      icon: <MessageSquare className="w-5 h-5" />,
      active: pathname.startsWith("/admin/forum/categories"),
    },
    {
      name: "Fórum - Moderação",
      href: "/admin/forum/moderation",
      icon: <MessageSquare className="w-5 h-5" />,
      active: pathname.startsWith("/admin/forum/moderation"),
    },
  ] : [];

  // Links de configurações e usuário
  const configNavItems: NavItem[] = isAuthenticated ? [
    {
      name: "Perfil",
      href: "/profile",
      icon: <User className="w-5 h-5" />,
      active: pathname === "/profile",
    },
    {
      name: "Definições",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      active: pathname === "/dashboard/settings",
    },
    {
      name: "Terminar Sessão",
      href: "#",
      icon: <LogOut className="w-5 h-5" />,
      active: false,
      onClick: handleLogout,
    },
  ] : [
    {
      name: "Iniciar Sessão",
      href: "/login",
      icon: <User className="w-5 h-5" />,
      active: pathname === "/login",
    },
    {
      name: "Registar",
      href: "/register",
      icon: <User className="w-5 h-5" />,
      active: pathname === "/register",
    },
  ];

  // Componente para renderizar os itens do menu
  const renderNavItems = (items: NavItem[], showLabel = true) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={cn(
                "flex items-center w-full px-4 py-3 rounded-md transition-colors",
                "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {showLabel && <span>{item.name}</span>}
            </button>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-md transition-colors",
                item.active
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {showLabel && <span>{item.name}</span>}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 animate-pulse"></div>
    );
  }

  // Sidebar para versão desktop
  const SidebarContent = ({ showLabels = true }: SidebarContentProps) => (
    <>
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {showLabels ? (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              UsabilityGrade Platform 
            </h2>
          ) : (
            <span className="text-xl font-bold">UG</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className="py-4 flex-1 overflow-y-auto">
        <nav className="px-2 space-y-6">
          <div>
            {showLabels && <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Principal</h3>}
            {renderNavItems(mainNavItems.filter(item => item.public || isAuthenticated), showLabels)}
          </div>

          {isAdmin && adminNavItems.length > 0 && (
            <div>
              {showLabels && <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Administração</h3>}
              {renderNavItems(adminNavItems, showLabels)}
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {showLabels && <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Conta</h3>}
        {renderNavItems(configNavItems, showLabels)}
      </div>
    </>
  );

  // Renderização completa do menu lateral
  return (
    <>
      {/* Sidebar para desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 hidden md:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent showLabels={!collapsed} />
      </aside>

      {/* Botão para abrir menu mobile */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-500 dark:text-gray-400"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar para mobile - sobreposto */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 max-w-xs bg-white dark:bg-gray-800 flex flex-col h-full">
            <SidebarContent showLabels={true} />
          </aside>
        </div>
      )}

      {/* Espaço para empurrar o conteúdo */}
      <div className={cn("transition-all duration-300 md:pl-64", collapsed && "md:pl-20")} />
    </>
  );
} 