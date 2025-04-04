import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ForumPostForm } from "@/components/forum/forum-post-form";
import { Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

interface TopicPageProps {
  params: {
    id: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const session = await getServerSession(authOptions);
  
  // Incrementar visualizações
  await prisma.forumTopic.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  const topic = await prisma.forumTopic.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      category: true,
      posts: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  const isAdmin = session?.user.role === "ADMIN";
  const isModerator = isAdmin || session?.user.role === "MODERATOR";
  const canReply = !topic.isLocked || isModerator;
  const isAuthor = session?.user.id === topic.author.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm breadcrumbs mb-2">
            <Link href="/forum" className="text-muted-foreground hover:text-foreground">
              Fórum
            </Link>
            {" / "}
            <Link href={`/forum/categories/${topic.category.slug}`} className="text-muted-foreground hover:text-foreground">
              {topic.category.name}
            </Link>
          </div>
          <PageHeader>
            <PageHeaderHeading>{topic.title}</PageHeaderHeading>
          </PageHeader>
        </div>
        {(isModerator || isAuthor) && (
          <div className="flex gap-2">
            {isModerator && (
              <Button variant={topic.isLocked ? "outline" : "destructive"} size="sm" asChild>
                <Link href={`/forum/topics/${topic.id}/toggle-lock`}>
                  {topic.isLocked ? "Desbloquear Tópico" : "Bloquear Tópico"}
                </Link>
              </Button>
            )}
            {(isModerator || isAuthor) && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/forum/topics/${topic.id}/edit`}>
                  Editar
                </Link>
              </Button>
            )}
            {isModerator && (
              <Button variant="destructive" size="sm" asChild>
                <Link href={`/forum/topics/${topic.id}/delete`}>
                  Excluir
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={topic.author.image || undefined} alt={topic.author.name || "Usuário"} />
              <AvatarFallback>{topic.author.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{topic.author.name || "Usuário anônimo"}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(topic.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {topic.author.role === "ADMIN" ? "Administrador" : 
                 topic.author.role === "MODERATOR" ? "Moderador" : "Membro"}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: topic.content }} />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground border-t p-4">
            <div className="flex-1">
              Visualizações: {topic.views}
            </div>
          </CardFooter>
        </Card>

        {topic.posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Respostas ({topic.posts.length})
            </h2>

            {topic.posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.image || undefined} alt={post.author.name || "Usuário"} />
                    <AvatarFallback>{post.author.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{post.author.name || "Usuário anônimo"}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.author.role === "ADMIN" ? "Administrador" : 
                       post.author.role === "MODERATOR" ? "Moderador" : "Membro"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                </CardContent>
                <CardFooter className="border-t p-4">
                  {(isModerator || post.author.id === session?.user.id) && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/forum/posts/${post.id}/edit`}>
                          Editar
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" asChild>
                        <Link href={`/forum/posts/${post.id}/delete`}>
                          Excluir
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {topic.isLocked && !canReply ? (
          <div className="bg-muted p-4 rounded-md flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <p className="text-sm">Este tópico está bloqueado e não aceita novas respostas.</p>
          </div>
        ) : (
          session ? (
            <div className="space-y-4">
              <Separator />
              <h2 className="text-xl font-semibold tracking-tight">Responder</h2>
              <ForumPostForm topicId={topic.id} />
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-sm mb-2">Faça login para responder a este tópico</p>
              <Button asChild>
                <Link href={`/login?redirectTo=/forum/topics/${topic.id}`}>
                  Entrar
                </Link>
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
} 