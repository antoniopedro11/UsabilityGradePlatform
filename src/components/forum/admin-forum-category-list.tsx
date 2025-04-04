"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { ForumCategory } from "@/types";
import { EditCategoryDialog } from "./edit-category-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdminForumCategoryList() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ForumCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editCategory, setEditCategory] = useState<ForumCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/forum/categories");
      if (!response.ok) {
        throw new Error("Falha ao carregar categorias");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Erro ao carregar categorias. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editCategory) {
      setFormName(editCategory.name);
      setFormSlug(editCategory.slug);
      setFormDescription(editCategory.description);
    }
  }, [editCategory]);

  const handleDelete = (category: ForumCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/forum/categories?id=${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao excluir categoria");
      }

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      });

      // Atualizar a lista de categorias
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao excluir categoria",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEditClick = (category: ForumCategory) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;

    try {
      const response = await fetch(`/api/forum/categories?id=${editCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          description: formDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar categoria");
      }

      const updatedCategory = await response.json();
      
      // Atualizar a lista de categorias
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      
      setIsEditDialogOpen(false);
      toast({
        title: "Categoria atualizada",
        description: `A categoria "${updatedCategory.name}" foi atualizada com sucesso.`,
      });
    } catch (err: any) {
      console.error("Erro ao atualizar categoria:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao atualizar categoria",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/forum/categories?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao excluir categoria");
      }

      // Remover categoria da lista
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== categoryId)
      );
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (err: any) {
      console.error("Erro ao excluir categoria:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao excluir categoria",
        variant: "destructive",
      });
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Carregando categorias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={fetchCategories} 
          variant="outline" 
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
        <p className="text-muted-foreground mt-2">
          Use o botão "Criar Categoria" para adicionar uma nova categoria ao fórum
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead className="w-[200px]">Slug</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{formatDate(category.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Abrir menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a 
                        href={`/forum/${category.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver Tópicos</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(category)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(category)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>
                Faça alterações na categoria selecionada.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nome da categoria"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="slug-da-categoria"
                    pattern="^[a-z0-9-]+$"
                    title="Apenas letras minúsculas, números e hífens"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    O slug deve conter apenas letras minúsculas, números e hífens.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descrição da categoria"
                    rows={3}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"? Esta ação excluirá todos os tópicos e respostas associados a esta categoria. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 