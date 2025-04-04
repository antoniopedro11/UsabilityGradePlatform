"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
      year: 'numeric'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col justify-center items-center min-h-[50vh] bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Carregando artigo...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Aguarde enquanto buscamos as informações</p>
        </div>
      </div>
    )
  }

  if (!article && !isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-red-200 dark:border-red-900">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <ChevronLeft className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Artigo não encontrado</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            O artigo que você está procurando não existe ou pode ter sido removido.
          </p>
          <Button asChild>
            <Link href="/knowledge" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Base de Conhecimento
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={category ? `/knowledge?category=${category.id}` : "/knowledge"}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {category ? `Voltar para ${category.name}` : "Voltar para Base de Conhecimento"}
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg mb-6 border border-red-200 dark:border-red-800 flex items-start max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Erro ao carregar artigo</p>
            <p className="mt-1 text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-blue-500 dark:border-t-blue-400">
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">{article?.title}</CardTitle>
            {category && (
              <div className="mt-4">
                <Badge 
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-sm"
                >
                  {category.name}
                </Badge>
              </div>
            )}
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Atualizado em {article && formatDate(article.updatedAt)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article?.content.split('\n').map((paragraph, index) => (
              paragraph.trim() 
                ? <p key={index} className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {paragraph}
                  </p> 
                : <div key={index} className="my-4"></div>
            ))}
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <Button variant="outline" asChild size="sm">
              <Link href="/knowledge">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para a lista
              </Link>
            </Button>
            
            {category && (
              <Button variant="outline" asChild size="sm">
                <Link href={`/knowledge?category=${category.id}`}>
                  Ver mais em {category.name}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 