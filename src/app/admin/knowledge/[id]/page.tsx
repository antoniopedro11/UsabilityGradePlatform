"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Edit, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KnowledgeArticle, KnowledgeCategory } from "@/types"

interface KnowledgeArticlePageProps {
  params: {
    id: string
  }
}

export default function KnowledgeArticlePage({ params }: KnowledgeArticlePageProps) {
  const { id } = params
  
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [category, setCategory] = useState<KnowledgeCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/knowledge/${id}`)
        if (!response.ok) {
          throw new Error("Falha ao carregar artigo")
        }
        const data = await response.json()
        setArticle(data)
        
        // Se tiver categoria, buscar detalhes da categoria
        if (data.categoryId) {
          try {
            const catResponse = await fetch(`/api/admin/knowledge-categories/${data.categoryId}`)
            if (catResponse.ok) {
              const catData = await catResponse.json()
              setCategory(catData)
            }
          } catch (catErr) {
            console.error("Erro ao carregar categoria:", catErr)
          }
        }
      } catch (err) {
        console.error("Erro ao carregar artigo:", err)
        setError("Não foi possível carregar o artigo")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Carregando artigo...</p>
        </div>
      </div>
    )
  }

  if (!article && !isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive">
          Artigo não encontrado ou erro ao carregar
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/knowledge">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Base de Conhecimento
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/admin/knowledge">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Base de Conhecimento
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href={`/admin/knowledge/edit/${id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Artigo
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{article?.title}</CardTitle>
              {category && (
                <div className="mt-2">
                  <Badge variant="outline">{category.name}</Badge>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Criado em: {article && formatDate(article.createdAt)}</div>
              <div>Atualizado em: {article && formatDate(article.updatedAt)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {article?.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 