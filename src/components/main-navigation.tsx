"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaUser, FaChartBar, FaClipboardList, FaCog, FaUsers, FaSignOutAlt, FaProjectDiagram, FaTasks, FaBook, FaComments, FaLock } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function MainNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Verificar se está no navegador antes de acessar localStorage
    if (typeof window !== "undefined") {
      // Carregar dados do usuário do localStorage
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          
          // Verificar se o usuário é um administrador
          const role = parsedData.role?.toLowerCase() || "";
          setIsAdmin(role === "admin");
        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const isAuthenticated = !!userData;

  // Links de navegação principal
  const mainNavItems = [
    {
      name: "Início",
      href: "/",
      icon: <FaHome className="w-5 h-5" />,
      active: pathname === "/",
      public: true,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FaChartBar className="w-5 h-5" />,
      active: pathname === "/dashboard",
      public: false,
    },
    {
      name: "Projetos",
      href: "/dashboard/projects",
      icon: <FaProjectDiagram className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/projects"),
      public: false,
    },
    {
      name: "Avaliações",
      href: "/dashboard/evaluations",
      icon: <FaClipboardList className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/evaluations"),
      public: false,
    },
    {
      name: "Base de Conhecimento",
      href: "/knowledge",
      icon: <FaBook className="w-5 h-5" />,
      active: pathname.startsWith("/knowledge"),
      public: true,
    },
    {
      name: "Fórum",
      href: "/forum",
      icon: <FaComments className="w-5 h-5" />,
      active: pathname.startsWith("/forum"),
      public: true,
    },
  ];

  // Links de administração (apenas para admins)
  const adminNavItems = isAdmin ? [
    {
      name: "Painel Admin",
      href: "/admin",
      icon: <FaLock className="w-5 h-5" />,
      active: pathname === "/admin",
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: <FaUsers className="w-5 h-5" />,
      active: pathname.startsWith("/admin/users"),
    },
    {
      name: "Fórum Admin",
      href: "/admin/forum",
      icon: <FaComments className="w-5 h-5" />,
      active: pathname.startsWith("/admin/forum"),
    },
  ] : [];

  // Links de usuário
  const userNavItems = isAuthenticated ? [
    {
      name: "Perfil",
      href: "/profile",
      icon: <FaUser className="w-5 h-5" />,
      active: pathname === "/profile",
    },
    {
      name: "Configurações",
      href: "/dashboard/settings",
      icon: <FaCog className="w-5 h-5" />,
      active: pathname === "/dashboard/settings",
    },
    {
      name: "Sair",
      href: "#",
      icon: <FaSignOutAlt className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ] : [
    {
      name: "Entrar",
      href: "/login",
      icon: <FaUser className="w-5 h-5" />,
      active: pathname === "/login",
    },
    {
      name: "Registrar",
      href: "/register",
      icon: <FaUser className="w-5 h-5" />,
      active: pathname === "/register",
    },
  ];

  if (isLoading) {
    return <div className="animate-pulse h-12 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>;
  }

  return (
    <nav className={cn("bg-white dark:bg-gray-800 shadow-sm", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                Usability Grade
              </span>
            </Link>
          </div>

          {/* Botão para colapsar em dispositivos móveis */}
          <div className="md:hidden">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {collapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Links de navegação principal - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {mainNavItems
              .filter(item => item.public || isAuthenticated)
              .map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    item.active
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

            {/* Admin links em desktop */}
            {isAdmin && adminNavItems.length > 0 && (
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                  <FaLock className="w-5 h-5 mr-2" />
                  <span>Admin</span>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  {adminNavItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                        item.active && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <span className="inline-flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Usuário dropdown em desktop */}
            <div className="relative group ml-4">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                <FaUser className="w-5 h-5 mr-2" />
                <span>{userData ? (userData.name || "Usuário") : "Conta"}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                {userNavItems.map(item => (
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="inline-flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                        item.active && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <span className="inline-flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links de navegação móvel - Quando collapsed = true */}
        {collapsed && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {mainNavItems
                .filter(item => item.public || isAuthenticated)
                .map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium",
                      item.active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <span className="inline-flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                  </Link>
                ))}

              {/* Admin links em mobile */}
              {isAdmin && adminNavItems.length > 0 && (
                <>
                  <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Administração
                    </p>
                  </div>
                  {adminNavItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        item.active
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                      )}
                    >
                      <span className="inline-flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  ))}
                </>
              )}

              {/* Usuário links em mobile */}
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  {isAuthenticated ? "Sua Conta" : "Acesso"}
                </p>
              </div>
              {userNavItems.map(item => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                  >
                    <span className="inline-flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium",
                      item.active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <span className="inline-flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 