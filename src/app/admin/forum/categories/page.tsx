import { Metadata } from "next";
import { Suspense } from "react";
import { AdminForumCategoryList } from "@/components/forum/admin-forum-category-list";
import { CreateCategoryDialog } from "@/components/forum/create-category-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Administração do Fórum - Categorias",
  description: "Gerenciamento de categorias do fórum de discussão",
};

export default function AdminForumCategoriesPage() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Categorias</h1>
        <CreateCategoryDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Categoria
          </Button>
        </CreateCategoryDialog>
      </div>
      <Separator />
      <Suspense fallback={<div className="text-center py-10">Carregando categorias...</div>}>
        <AdminForumCategoryList />
      </Suspense>
    </div>
  );
} 