import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Pin, LockIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ForumTopicListProps {
  categoryId: string;
}

export async function ForumTopicList({ categoryId }: ForumTopicListProps) {
  const topics = await prisma.forumTopic.findMany({
    where: {
      categoryId,
    },
    orderBy: [
      { isPinned: 'desc' },
      { updatedAt: 'desc' },
    ],
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (topics.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-lg font-medium">Nenhum tópico encontrado</h3>
        <p className="text-muted-foreground mt-2">
          Seja o primeiro a criar um tópico nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Link key={topic.id} href={`/forum/topics/${topic.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {topic.isPinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    {topic.isLocked && (
                      <LockIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{topic.title}</h3>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {topic.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {topic.content.length > 150 ? '...' : ''}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {topic._count.posts} {topic._count.posts === 1 ? 'resposta' : 'respostas'}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.author.image || undefined} alt={topic.author.name || 'Usuário'} />
                  <AvatarFallback>{topic.author.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span>{topic.author.name || 'Usuário anônimo'}</span>
              </div>
              <div>
                {formatDistanceToNow(new Date(topic.createdAt), { 
                  addSuffix: true,
                  locale: ptBR
                })}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 