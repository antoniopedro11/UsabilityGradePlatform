import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ForumSettings } from "@/components/forum/forum-settings";
import { ForumModRules } from "@/components/forum/forum-mod-rules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Configurações do Fórum",
  description: "Configure as opções e regras do fórum de discussão"
};

export default function ForumSettingsPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Fórum</h1>
        <p className="text-muted-foreground mt-2">
          Configure as opções e regras para o fórum de discussão
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="moderation">Regras de Moderação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <ForumSettings />
        </TabsContent>
        
        <TabsContent value="moderation">
          <ForumModRules />
        </TabsContent>
      </Tabs>
    </div>
  );
} 