import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ForumTopicList } from "@/components/forum/forum-topic-list";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Suspense } from "react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.forumCategory.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderHeading>{category.name}</PageHeaderHeading>
        {category.description && (
          <PageHeaderDescription>{category.description}</PageHeaderDescription>
        )}
      </PageHeader>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tópicos</h2>
        <Link href={`/forum/categories/${category.slug}/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Tópico
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10">Carregando tópicos...</div>}>
        <ForumTopicList categoryId={category.id} />
      </Suspense>
    </div>
  );
} 