"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { KnowledgeArticle, KnowledgeCategory } from "@/types"

export default function EditKnowledgeArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { id } = params
  
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Carregar artigo e categorias
  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/knowledge/${id}`)
        if (!response.ok) {
          throw new Error("Falha ao carregar artigo")
        }
        
        const articleData = await response.json()
        setArticle(articleData)
        setTitle(articleData.title)
        setContent(articleData.content)
        setCategoryId(articleData.categoryId || "")
      } catch (err) {
        console.error("Erro ao carregar artigo:", err)
        setError("Ocorreu um erro ao carregar o artigo")
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/knowledge-categories")
        if (!response.ok) {
          throw new Error("Falha ao carregar categorias")
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchArticle()
    fetchCategories()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    if (!content.trim()) {
      setError("O conteúdo é obrigatório")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId: categoryId || "",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Falha ao atualizar artigo")
      }

      router.push("/admin/knowledge")
    } catch (err: any) {
      console.error("Erro ao atualizar artigo:", err)
      setError(err.message || "Ocorreu um erro ao atualizar o artigo")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center w-full p-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-lg">Carregando artigo...</p>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button asChild>
                <Link href="/admin/knowledge">Voltar para lista de artigos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/knowledge">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Base de Conhecimento
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Artigo</CardTitle>
          <CardDescription>
            Atualize as informações do artigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do artigo"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem categoria</SelectItem>
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Carregando...
                      </span>
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      Nenhuma categoria disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Conteúdo <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Conteúdo do artigo"
                rows={12}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/knowledge">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 