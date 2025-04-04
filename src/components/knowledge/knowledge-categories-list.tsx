"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Edit, 
  Loader2, 
  MoreHorizontal, 
  Search, 
  Trash2 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { KnowledgeCategory } from "@/types"

export function KnowledgeCategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<KnowledgeCategory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<KnowledgeCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCategories(
        categories.filter(category => 
          category.name.toLowerCase().includes(query) || 
          (category.description && category.description.toLowerCase().includes(query))
        )
      )
    }
  }, [searchQuery, categories])

  async function fetchCategories() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/knowledge-categories')
      if (!response.ok) {
        throw new Error('Falha ao carregar categorias')
      }
      const data = await response.json()
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      setError('Erro ao carregar categorias. Por favor, tente novamente.')
      console.error('Erro ao buscar categorias:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(value: string) {
    setSearchQuery(value)
  }

  function confirmDelete(category: KnowledgeCategory) {
    setCategoryToDelete(category)
    setShowDeleteDialog(true)
    setDeleteError(null)
  }

  function cancelDelete() {
    setShowDeleteDialog(false)
    setCategoryToDelete(null)
    setDeleteError(null)
  }

  async function deleteCategory() {
    if (!categoryToDelete) return

    setIsDeleting(true)
    setDeleteError(null)
    
    try {
      const response = await fetch(`/api/admin/knowledge-categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao excluir categoria')
      }

      // Remover a categoria da lista
      setCategories(categories.filter(c => c.id !== categoryToDelete.id))
      setShowDeleteDialog(false)
      setCategoryToDelete(null)
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err)
      setDeleteError(err.message || 'Falha ao excluir categoria. Por favor, tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar categorias..."
          className="flex-1"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCategories.map(category => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {category.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/knowledge/categories/edit/${category.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirmDelete(category)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/knowledge?categoryId=${category.id}`}>
                      Ver artigos
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? `Nenhuma categoria encontrada para "${searchQuery}"` : "Nenhuma categoria disponível."}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-4">
              <Link href="/admin/knowledge/categories/new">
                Criar sua primeira categoria
              </Link>
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
              {deleteError && (
                <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md">
                  {deleteError}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 