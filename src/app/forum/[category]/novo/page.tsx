import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateTopicForm } from "@/components/forum/create-topic-form";
import { ArrowLeft } from "lucide-react";

interface NewTopicPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({
  params,
}: NewTopicPageProps): Promise<Metadata> {
  // Obter a categoria pelo slug
  const category = await prisma.forumCategory.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    return {
      title: "Categoria não encontrada",
    };
  }

  return {
    title: `Novo Tópico | ${category.name}`,
    description: `Criar um novo tópico na categoria ${category.name}`,
  };
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  // Verificar se o usuário está autenticado
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Redirecionar para a página de login se não estiver autenticado
    redirect("/api/auth/signin");
  }

  // Obter a categoria pelo slug
  const category = await prisma.forumCategory.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link 
        href={`/forum/${params.category}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Voltar para {category.name}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Tópico</h1>
        <p className="text-muted-foreground mt-1">
          Categoria: {category.name}
        </p>
      </div>

      <div className="max-w-3xl">
        <CreateTopicForm categoryId={category.id} categorySlug={category.slug} />
      </div>
    </div>
  );
} 