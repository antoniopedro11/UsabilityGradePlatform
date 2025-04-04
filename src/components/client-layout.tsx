"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarNavigation } from "@/components/sidebar-navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Verificar se estamos em uma página pública onde não deve mostrar a sidebar
  const isPublicPage = pathname === "/" || 
                      pathname === "/login" || 
                      pathname === "/register" || 
                      pathname.startsWith("/auth");

  return (
    <div className="flex min-h-screen">
      {!isPublicPage && <SidebarNavigation />}
      <div className={cn("flex-1 flex flex-col", isPublicPage ? "w-full" : "")}>
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Plataforma de Avaliação de Usabilidade. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 