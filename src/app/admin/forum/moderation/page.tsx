import { Suspense } from "react";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ModeratorTopicList } from "@/components/forum/moderator-topic-list";
import { ModeratorPostList } from "@/components/forum/moderator-post-list";
import { ReportedContentList } from "@/components/forum/reported-content-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Moderação de Fórum",
  description: "Gerencie e modere tópicos e respostas do fórum",
};

export default function ForumModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Moderação de Fórum</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie e modere tópicos e respostas no fórum. Você pode revisar conteúdo reportado e tomar ações apropriadas.
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
    </div>
  );
} 