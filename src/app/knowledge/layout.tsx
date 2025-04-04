import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { ReactNode } from "react";

export const metadata = {
  title: "Base de Conhecimento",
  description: "Acesse artigos, guias e tutoriais para melhorar a usabilidade"
};

export default function KnowledgeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-6">
      <PageHeader>
        <PageHeaderHeading>Base de Conhecimento</PageHeaderHeading>
        <PageHeaderDescription>
          Acesse artigos, guias e tutoriais para melhorar a usabilidade e acessibilidade dos seus projetos
        </PageHeaderDescription>
      </PageHeader>
      <div className="mt-6">{children}</div>
    </div>
  );
} 