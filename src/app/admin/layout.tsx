"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FaChartBar, 
  FaUsers, 
  FaComments,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Itens do menu admin secundário
  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <FaChartBar className="w-5 h-5" />,
      active: pathname === "/admin",
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: <FaUsers className="w-5 h-5" />,
      active: pathname === "/admin/users",
    },
    {
      name: "Fórum",
      href: "/admin/forum",
      icon: <FaComments className="w-5 h-5" />,
      active: pathname.startsWith("/admin/forum"),
    },
  ];

  return (
    <div className="container mx-auto py-6 md:py-6 md:pl-8">
      {/* Menu secundário do Admin */}
      <div className="mb-6 flex overflow-x-auto pb-2">
        <nav className="flex space-x-4">
          {adminNavItems.map((item) => (
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

      {/* Conteúdo principal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
} 