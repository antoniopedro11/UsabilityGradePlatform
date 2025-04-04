"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { BookOpen, Loader2, Search } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KnowledgeArticle, KnowledgeCategory } from "@/types"

export default function KnowledgeBasePage() {
  console.log("Renderizando KnowledgeBasePage")
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")
  
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar artigos
  const fetchArticles = useCallback(async () => {
    setIsLoadingArticles(true)
    try {
      const url = selectedCategory 
        ? `/api/admin/knowledge?categoryId=${selectedCategory}`
        : '/api/admin/knowledge'
      
      console.log("Buscando artigos da URL:", url)
      const response = await fetch(url)
      console.log("Resposta da API artigos:", response.status)
      
      if (!response.ok) {
        throw new Error('Falha ao carregar artigos')
      }
      const data = await response.json()
      console.log("Artigos carregados:", data)
      setArticles(data)
      setFilteredArticles(data)
      setError(null)
    } catch (err) {
      console.error('Erro ao buscar artigos:', err)
      setError('Erro ao carregar artigos. Por favor, tente novamente.')
    } finally {
      setIsLoadingArticles(false)
    }
  }, [selectedCategory])

  // Carregar categorias
  useEffect(() => {
    console.log("useEffect para carregar categorias")
    async function fetchCategories() {
      try {
        console.log("Iniciando fetch de categorias")
        const response = await fetch('/api/admin/knowledge-categories')
        console.log("Resposta da API categorias:", response.status)
        if (!response.ok) {
          throw new Error('Falha ao carregar categorias')
        }
        const data = await response.json()
        console.log("Categorias carregadas:", data)
        setCategories(data)
      } catch (err) {
        console.error('Erro ao buscar categorias:', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Carregar artigos
  useEffect(() => {
    console.log("useEffect para carregar artigos, categoria selecionada:", selectedCategory)
    fetchArticles()
  }, [fetchArticles])

  // Filtrar artigos por busca
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

  function handleSearch(value: string) {
    setSearchQuery(value)
  }

  function handleCategorySelect(categoryId: string | null) {
    setSelectedCategory(categoryId)
    
    // Atualizar a URL
    if (categoryId) {
      router.push(`/knowledge?category=${categoryId}`)
    } else {
      router.push('/knowledge')
    }
  }

  function getCategoryName(categoryId: string): string {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Categoria desconhecida'
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
    <div className="container mx-auto py-8">
      <div className="relative w-full max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Pesquisar na base de conhecimento..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com categorias */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <p className="text-sm">Carregando...</p>
                </div>
              ) : (
                <ScrollArea className="h-[70vh] pr-4">
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategorySelect(null)}
                    >
                      Todas as categorias
                    </Button>
                    
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Artigos */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg mb-6 border border-red-200 dark:border-red-800 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Erro ao carregar artigos</p>
                <p className="mt-1 text-sm opacity-90">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchArticles}
                  className="mt-3 bg-white/80 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                >
                  <Loader2 className={`h-4 w-4 mr-2 ${isLoadingArticles ? 'animate-spin' : ''}`} />
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}

          {isLoadingArticles ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p className="text-muted-foreground">Carregando artigos...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <Link href={`/knowledge/${article.id}`} key={article.id}>
                  <Card className="h-full hover:shadow-md transition-all duration-200 border-l-4 hover:border-l-8 border-l-blue-500 dark:border-l-blue-400 hover:translate-x-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {article.title}
                          </CardTitle>
                          {article.categoryId && (
                            <div className="mt-2">
                              <Badge 
                                className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {getCategoryName(article.categoryId)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                        {article.content.split('\n').slice(0, 2).map((paragraph, i) => (
                          <p key={i} className="mb-1">
                            {paragraph.length > 120 ? `${paragraph.substring(0, 120)}...` : paragraph}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Atualizado em {formatDate(article.updatedAt)}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline">
                          Ler mais →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-12 text-center bg-white dark:bg-gray-800 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">
                {searchQuery
                  ? `Nenhum artigo encontrado para "${searchQuery}"`
                  : selectedCategory 
                    ? "Nenhum artigo disponível nesta categoria" 
                    : "Nenhum artigo disponível na base de conhecimento"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery
                  ? "Tente usar termos mais gerais ou verifique a ortografia"
                  : selectedCategory 
                    ? "Selecione outra categoria ou volte para todas as categorias" 
                    : "Em breve adicionaremos novos artigos à base de conhecimento"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mx-auto"
                >
                  Limpar pesquisa
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 