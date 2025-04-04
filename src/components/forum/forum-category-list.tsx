import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { MessageSquare } from "lucide-react";
import { ForumCategory } from "@prisma/client";

type CategoryWithCount = ForumCategory & {
  _count: {
    topics: number;
  };
};

export async function ForumCategoryList() {
  const categories = await prisma.forumCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: {
          topics: true,
        },
      },
    },
  });

  if (categories.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
        <p className="text-muted-foreground mt-2">
          Quando forem criadas categorias, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {categories.map((category: CategoryWithCount) => (
        <Link key={category.id} href={`/forum/categories/${category.slug}`} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>
                  {category._count.topics} {category._count.topics === 1 ? "tópico" : "tópicos"}
                </span>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Criado em {new Date(category.createdAt).toLocaleDateString("pt-BR")}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 