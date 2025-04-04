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

  // Verificar se é página pública e deve mostrar o footer
  const showFooter = !isPublicPage || (pathname === "/" || pathname === "/login" || pathname === "/register");

  return (
    <div className="flex min-h-screen">
      {!isPublicPage && <SidebarNavigation />}
      <div className={cn("flex-1 flex flex-col", isPublicPage ? "w-full" : "")}>
        <main className="flex-1">
          {children}
        </main>
        {showFooter && (
          <footer className="py-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} UsabilityGrade Platform. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
} 