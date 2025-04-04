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
import { KnowledgeCategory } from "@/types"

export default function NewKnowledgeArticlePage() {
  console.log("Renderizando NewKnowledgeArticlePage")
  
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Carregar categorias ao montar o componente
  useEffect(() => {
    console.log("useEffect para carregar categorias")
    async function fetchCategories() {
      try {
        console.log("Iniciando fetch de categorias")
        const response = await fetch("/api/admin/knowledge-categories")
        console.log("Resposta da API:", response.status, response.statusText)
        if (!response.ok) {
          console.error("Erro na resposta da API:", response.status, response.statusText)
          throw new Error(`Falha ao carregar categorias: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        console.log("Categorias carregadas:", data)
        setCategories(data)
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
        setError(`Erro ao carregar categorias: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Iniciando envio do formulário")
    
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
      const apiUrl = "/api/admin/knowledge";
      console.log("Enviando dados para API:", { title, content, categoryId, apiUrl })
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId: categoryId || null,
        }),
      })
      console.log("Resposta da API:", response.status, response.statusText)

      if (!response.ok) {
        const data = await response.json()
        console.error("Erro da API:", data)
        throw new Error(data.error || `Falha ao criar artigo: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Artigo criado com sucesso:", data)
      router.push("/admin/knowledge")
    } catch (err: any) {
      console.error("Erro ao criar artigo:", err)
      setError(err.message || "Ocorreu um erro ao criar o artigo")
    } finally {
      setIsSubmitting(false)
    }
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

      {isLoadingCategories && (
        <div className="flex items-center justify-center py-4 mb-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Carregando dados...</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Novo Artigo</CardTitle>
          <CardDescription>
            Crie um novo artigo para a base de conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => setError(null)}
              >
                Fechar
              </Button>
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
                    Salvar Artigo
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