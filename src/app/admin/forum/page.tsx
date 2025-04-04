import { Metadata } from "next";
import { ForumAdminTabs } from "@/components/admin/forum-admin-tabs";

export const metadata: Metadata = {
  title: "Administração do Fórum",
  description: "Gerencie categorias, tópicos e respostas do fórum de discussão"
};

export default function AdminForumPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Administração do Fórum</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie categorias, tópicos e respostas do fórum de discussão
          </p>
        </div>
        
        <ForumAdminTabs />
      </div>
    </div>
  );
} 