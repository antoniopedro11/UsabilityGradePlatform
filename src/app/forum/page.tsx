import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Metadata } from "next";
import { ForumCategory } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Fórum de Discussão",
  description: "Participe das discussões e compartilhe conhecimento"
};

// Tipo extendido para incluir a contagem de tópicos
interface ForumCategoryWithCount extends ForumCategory {
  _count: {
    topics: number;
  };
}

async function getCategories(): Promise<ForumCategoryWithCount[]> {
  try {
    // Obter a URL absoluta do servidor
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
      
    // Usar o novo endpoint simplificado
    const response = await fetch(`${baseUrl}/api/forum-categories`, { 
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidar a cada 60 segundos
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar categorias');
    }
    
    const categories = await response.json();
    return categories as ForumCategoryWithCount[];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export default async function ForumPage() {
  const categories = await getCategories();
  
  return (
    <div>
      {categories.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">Nenhuma categoria encontrada</h2>
          <p className="text-muted-foreground mt-2">
            As categorias serão adicionadas em breve.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category }: { category: ForumCategoryWithCount }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>
          {category.description || "Sem descrição disponível"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{category._count.topics} tópicos</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/forum/${category.slug}`}>
            Ver Tópicos <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="h-full flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 