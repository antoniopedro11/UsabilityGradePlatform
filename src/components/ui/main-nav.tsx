import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { UserType } from "@/types"

export function MainNav({
  userType,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  userType: UserType
}) {
  const pathname = usePathname()

  function isActive(path: string): boolean {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const isAdminActive = () => {
    return pathname.startsWith('/admin')
  }

  // Verificar se o usuário é administrador ou avaliador (moderador)
  const isAdminOrModerator = userType === "admin" || userType === "evaluator";

  return (
    <NavigationMenu className={cn("flex-1", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                class: isActive("/dashboard") ? "bg-accent" : ""
              })}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/diagnostic" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                class: isActive("/diagnostic") ? "bg-accent" : ""
              })}
            >
              Diagnóstico
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/knowledge" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                class: isActive("/knowledge") ? "bg-accent" : ""
              })}
            >
              Base de Conhecimento
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/forum" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                class: isActive("/forum") ? "bg-accent" : ""
              })}
            >
              Fórum
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {isAdminOrModerator && (
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(isAdminActive() && "bg-accent text-accent-foreground")}
            >
              Administração
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {userType === "admin" && (
                  <>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Dashboard Admin
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visualizar o painel administrativo
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin/users"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin/users") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Usuários
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerenciar usuários da plataforma
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin/forms"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin/forms") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Formulários
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerenciar formulários de diagnóstico
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin/templates"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin/templates") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Templates
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerenciar templates de relatórios
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin/knowledge"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin/knowledge") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Base de Conhecimento
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerenciar artigos e categorias da base de conhecimento
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/admin/forum/categories"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/admin/forum/categories") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            Fórum - Categorias
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gerenciar categorias do fórum de discussão
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </>
                )}
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin/forum/moderation"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive("/admin/forum/moderation") && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">
                        Fórum - Moderação
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Moderar tópicos e respostas do fórum
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
} 