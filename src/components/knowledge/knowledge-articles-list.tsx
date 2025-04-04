"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Edit, 
  Eye, 
  Loader2, 
  MoreHorizontal, 
  Search, 
  Trash2 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { KnowledgeArticle } from "@/types"

export function KnowledgeArticlesList() {
  const router = useRouter()
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<KnowledgeArticle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<Record<string, string>>({})
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredArticles(
        articles.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.content.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, articles])

  async function fetchArticles() {
    console.log('Iniciando fetchArticles')
    setIsLoading(true)
    setError(null)
    try {
      console.log('Fazendo requisição para /api/admin/knowledge')
      const response = await fetch('/api/admin/knowledge')
      console.log('Resposta recebida:', response.status, response.statusText)
      
      if (!response.ok) {
        console.error('Resposta não ok:', response.status, response.statusText)
        throw new Error(`Falha ao carregar artigos: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Dados recebidos:', data)
      
      setArticles(data)
      setFilteredArticles(data)
    } catch (err) {
      console.error('Erro ao buscar artigos:', err)
      setError(`Erro ao carregar artigos. Por favor, tente novamente. ${err instanceof Error ? err.message : ''}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCategories() {
    setIsLoadingCategories(true)
    try {
      const response = await fetch('/api/admin/knowledge-categories')
      if (!response.ok) {
        throw new Error('Falha ao carregar categorias')
      }
      const data = await response.json()
      
      const categoryMap: Record<string, string> = {}
      data.forEach((category: { id: string; name: string }) => {
        categoryMap[category.id] = category.name
      })
      
      setCategories(categoryMap)
    } catch (err) {
      console.error('Erro ao buscar categorias:', err)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  function handleSearch(value: string) {
    setSearchQuery(value)
  }

  function confirmDelete(article: KnowledgeArticle) {
    setArticleToDelete(article)
    setShowDeleteDialog(true)
  }

  function cancelDelete() {
    setShowDeleteDialog(false)
    setArticleToDelete(null)
  }

  async function deleteArticle() {
    if (!articleToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/knowledge/${articleToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir artigo')
      }

      // Remover o artigo da lista
      setArticles(articles.filter(a => a.id !== articleToDelete.id))
      setShowDeleteDialog(false)
      setArticleToDelete(null)
    } catch (err) {
      console.error('Erro ao excluir artigo:', err)
      setError('Falha ao excluir artigo. Por favor, tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-destructive flex flex-col items-center justify-center">
          <p className="text-center mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={fetchArticles}
            className="flex items-center"
          >
            <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar artigos..."
          className="flex-1"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-muted-foreground">Carregando artigos...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map(article => (
            <Card key={article.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {article.content.substring(0, 150)}...
                    </CardDescription>
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
                        <Link href={`/admin/knowledge/${article.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/knowledge/edit/${article.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirmDelete(article)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {article.categoryId && (
                      <Badge variant="outline">
                        {categories[article.categoryId] || "Categoria"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Atualizado em {formatDate(article.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? `Nenhum artigo encontrado para "${searchQuery}"` : "Nenhum artigo disponível."}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-4">
              <Link href="/admin/knowledge/new">
                Criar seu primeiro artigo
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
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteArticle}
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