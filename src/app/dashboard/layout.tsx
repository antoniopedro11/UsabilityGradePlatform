"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaChartBar, FaProjectDiagram, FaClipboardList, FaTasks } from "react-icons/fa";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do usuário do localStorage apenas no cliente
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Links secundários do dashboard
  const dashboardNavItems = [
    {
      name: "Visão Geral",
      href: "/dashboard",
      icon: <FaChartBar className="w-5 h-5" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Projetos",
      href: "/dashboard/projects",
      icon: <FaProjectDiagram className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/projects"),
    },
    {
      name: "Avaliações",
      href: "/dashboard/evaluations",
      icon: <FaClipboardList className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/evaluations"),
    },
    {
      name: "Tarefas",
      href: "/dashboard/tasks",
      icon: <FaTasks className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/tasks"),
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 md:py-6 md:pl-8">
        <div className="animate-pulse h-12 w-full bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
        <div className="animate-pulse h-64 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-6 md:py-6 md:pl-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Você precisa estar autenticado para acessar o dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-6 md:pl-8">
      {/* Subnav do Dashboard */}
      <div className="mb-6 flex overflow-x-auto pb-2">
        <nav className="flex space-x-4">
          {dashboardNavItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                item.active
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Conteúdo do Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
} 