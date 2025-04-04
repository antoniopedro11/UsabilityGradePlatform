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
import { KnowledgeCategory } from "@/types"

interface EditKnowledgeCategoryPageProps {
  params: {
    id: string
  }
}

export default function EditKnowledgeCategoryPage({ params }: EditKnowledgeCategoryPageProps) {
  const router = useRouter()
  const { id } = params
  
  const [category, setCategory] = useState<KnowledgeCategory | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`/api/admin/knowledge-categories/${id}`)
        if (!response.ok) {
          throw new Error("Falha ao carregar categoria")
        }
        const data = await response.json()
        setCategory(data)
        setName(data.name)
        setDescription(data.description || "")
      } catch (err) {
        console.error("Erro ao carregar categoria:", err)
        setError("Não foi possível carregar a categoria")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("O nome da categoria é obrigatório")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/knowledge-categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Falha ao atualizar categoria")
      }

      router.push("/admin/knowledge?tab=categories")
    } catch (err: any) {
      console.error("Erro ao atualizar categoria:", err)
      setError(err.message || "Ocorreu um erro ao atualizar a categoria")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Carregando categoria...</p>
        </div>
      </div>
    )
  }

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive">
          Categoria não encontrada ou erro ao carregar
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/knowledge?tab=categories">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Categorias
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/knowledge?tab=categories">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Categorias
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Categoria</CardTitle>
          <CardDescription>
            Edite as informações da categoria na base de conhecimento
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
              <label htmlFor="name" className="text-sm font-medium">
                Nome <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da categoria"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da categoria (opcional)"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/knowledge?tab=categories">Cancelar</Link>
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
                    Atualizar Categoria
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