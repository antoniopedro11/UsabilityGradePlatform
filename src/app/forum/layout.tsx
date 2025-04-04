import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { ReactNode } from "react";

export const metadata = {
  title: "Fórum de Discussão",
  description: "Participe das discussões no nosso fórum",
};

export default function ForumLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-6">
      <PageHeader>
        <PageHeaderHeading>Fórum de Discussão</PageHeaderHeading>
        <PageHeaderDescription>
          Participe das discussões e compartilhe conhecimento com a comunidade
        </PageHeaderDescription>
      </PageHeader>
      <div className="mt-6">{children}</div>
    </div>
  );
} 