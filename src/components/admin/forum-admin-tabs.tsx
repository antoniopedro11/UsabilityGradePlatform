"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminForumCategoryList } from "@/components/forum/admin-forum-category-list";
import { CreateCategoryDialog } from "@/components/forum/create-category-dialog";
import { ModeratorTopicList } from "@/components/forum/moderator-topic-list";
import { ModeratorPostList } from "@/components/forum/moderator-post-list";
import { ReportedContentList } from "@/components/forum/reported-content-list";
import { Suspense } from "react";

export function ForumAdminTabs() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("categories");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:w-auto">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="moderation">Moderação</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Aba de Categorias */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Gerenciamento de Categorias</h2>
            <CreateCategoryDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Criar Categoria
              </Button>
            </CreateCategoryDialog>
          </div>
          <Separator />
          <Suspense fallback={<div className="text-center py-10">Carregando categorias...</div>}>
            <AdminForumCategoryList />
          </Suspense>
        </TabsContent>

        {/* Aba de Moderação */}
        <TabsContent value="moderation" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Moderação de Conteúdo</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Revise e modere tópicos e respostas no fórum
            </p>
          </div>
          <Separator />

          <Tabs defaultValue="reported" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reported">Conteúdo Reportado</TabsTrigger>
              <TabsTrigger value="topics">Tópicos</TabsTrigger>
              <TabsTrigger value="posts">Respostas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reported" className="space-y-4">
              <h4 className="text-sm font-medium">Conteúdo Reportado</h4>
              <Suspense fallback={<div>Carregando conteúdo reportado...</div>}>
                <ReportedContentList />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="topics" className="space-y-4">
              <h4 className="text-sm font-medium">Moderação de Tópicos</h4>
              <Suspense fallback={<div>Carregando tópicos...</div>}>
                <ModeratorTopicList />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="posts" className="space-y-4">
              <h4 className="text-sm font-medium">Moderação de Respostas</h4>
              <Suspense fallback={<div>Carregando respostas...</div>}>
                <ModeratorPostList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Aba de Configurações */}
        <TabsContent value="settings" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Configurações do Fórum</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure as opções gerais do fórum de discussão
            </p>
          </div>
          <Separator />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Permissões de Publicação</h3>
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure quem pode criar novos tópicos e responder no fórum
                </p>
                {/* Conteúdo de configurações seria implementado aqui */}
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Regras e Diretrizes</h3>
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Defina as regras e diretrizes para publicação no fórum
                </p>
                {/* Conteúdo de configurações seria implementado aqui */}
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 