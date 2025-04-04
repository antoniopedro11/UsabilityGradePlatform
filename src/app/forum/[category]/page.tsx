import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle, Eye, Calendar, Lock, Pin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
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
    title: `${category.name} | Fórum de Discussão`,
    description: category.description || "Tópicos de discussão sobre " + category.name,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Obter a categoria pelo slug
  const category = await prisma.forumCategory.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    notFound();
  }

  // Obter os tópicos da categoria
  const topics = await prisma.forumTopic.findMany({
    where: { categoryId: category.id },
    orderBy: [
      { isPinned: 'desc' }, // Tópicos fixados primeiro
      { createdAt: 'desc' }, // Mais recentes primeiro
    ],
    include: {
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  // Função para formatar a data
  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  // Função para obter o badge de status
  const getStatusBadge = (topic: any) => {
    if (topic.isPinned) {
      return <Badge className="ml-2"><Pin className="h-3 w-3 mr-1" /> Fixado</Badge>;
    }
    
    if (topic.isClosed) {
      return <Badge variant="secondary" className="ml-2"><Lock className="h-3 w-3 mr-1" /> Fechado</Badge>;
    }
    
    return null;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/forum" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            ← Voltar para o Fórum
          </Link>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/forum/${category.slug}/novo`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Tópico
          </Link>
        </Button>
      </div>

      {topics.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum tópico encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Seja o primeiro a criar um tópico nesta categoria!</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/forum/${category.slug}/novo`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Tópico
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id} className={topic.isPinned ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Link href={`/forum/${category.slug}/${topic.slug}`} className="hover:underline">
                    {topic.title}
                  </Link>
                  {getStatusBadge(topic)}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  <span>Por {topic.author.name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(topic.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardFooter className="pt-2 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>
                    {topic._count.responses}{" "}
                    {topic._count.responses === 1 ? "resposta" : "respostas"}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/forum/${category.slug}/${topic.slug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Tópico
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 