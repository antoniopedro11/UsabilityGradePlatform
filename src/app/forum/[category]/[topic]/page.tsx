import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, MessageSquare, Lock, Pin } from "lucide-react";
import { CreateResponseForm } from "@/components/forum/create-response-form";
import ClientAuthCheck from "@/components/forum/client-auth-check";

interface TopicPageProps {
  params: {
    category: string;
    topic: string;
  };
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  // Obter o tópico pelo slug
  const topic = await prisma.forumTopic.findFirst({
    where: {
      slug: params.topic,
      category: {
        slug: params.category,
      },
    },
    include: {
      category: true,
    },
  });

  if (!topic) {
    return {
      title: "Tópico não encontrado",
    };
  }

  return {
    title: `${topic.title} | ${topic.category.name}`,
    description: `Discussão sobre ${topic.title} na categoria ${topic.category.name}`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  // Obter o tópico pelo slug
  const topic = await prisma.forumTopic.findFirst({
    where: {
      slug: params.topic,
      category: {
        slug: params.category,
      },
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  // Atualizar a contagem de visualizações
  await prisma.forumTopic.update({
    where: { id: topic.id },
    data: { views: { increment: 1 } },
  });

  // Obter as respostas do tópico
  const responses = await prisma.forumResponse.findMany({
    where: { topicId: topic.id },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Verificar se o tópico está fechado
  const isTopicOpen = topic.isClosed !== true;

  // Função para formatar a data
  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
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
      {/* Navegação */}
      <Link 
        href={`/forum/${params.category}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Voltar para {topic.category.name}
      </Link>

      {/* Cabeçalho do tópico */}
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          {getStatusBadge(topic)}
        </div>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            {topic.author.image && (
              <img 
                src={topic.author.image} 
                alt={topic.author.name || "Avatar"} 
                className="h-6 w-6 rounded-full mr-2"
              />
            )}
            <span>{topic.author.name}</span>
          </div>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(topic.createdAt)}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            {responses.length} {responses.length === 1 ? "resposta" : "respostas"}
          </span>
        </div>
      </div>

      {/* Conteúdo do tópico */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: topic.content }} />
      </div>

      <Separator className="my-8" />

      {/* Respostas */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {responses.length} {responses.length === 1 ? "Resposta" : "Respostas"}
        </h2>

        {responses.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <h3 className="text-lg font-medium">Nenhuma resposta ainda</h3>
            <p className="text-muted-foreground mt-2">
              Seja o primeiro a responder a este tópico!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {responses.map((response) => (
              <div key={response.id} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {response.author.image && (
                    <img 
                      src={response.author.image} 
                      alt={response.author.name || "Avatar"} 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  )}
                  <div>
                    <div className="font-medium">{response.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(response.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: response.content }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Formulário de resposta com verificação de autenticação do cliente */}
      <ClientAuthCheck topicId={topic.id} isTopicOpen={isTopicOpen} />
    </div>
  );
} 