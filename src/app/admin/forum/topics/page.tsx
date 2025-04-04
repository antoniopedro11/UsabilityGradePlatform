import { Suspense } from "react";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { AdminTopicList } from "@/components/forum/admin-topic-list";

export const metadata: Metadata = {
  title: "Gerenciamento de Tópicos - Fórum",
  description: "Administre todos os tópicos do fórum de discussão"
};

export default function AdminForumTopicsPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Tópicos</h1>
        <p className="text-muted-foreground mt-2">
          Administre todos os tópicos do fórum, incluindo destacar, fechar ou remover tópicos.
        </p>
      </div>
      
      <Separator />
      
      <Suspense fallback={
        <div className="text-center py-10">
          <p className="text-muted-foreground">Carregando tópicos...</p>
        </div>
      }>
        <AdminTopicList />
      </Suspense>
    </div>
  );
} 