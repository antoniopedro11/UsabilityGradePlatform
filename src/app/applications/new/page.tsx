"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface FormData {
  name: string;
  description: string;
  type: string;
  url: string;
}

export default function NewApplicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    type: "WEB",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!formData.name.trim()) {
        throw new Error("O nome da aplicação é obrigatório");
      }
      
      if (!formData.type.trim()) {
        throw new Error("O tipo da aplicação é obrigatório");
      }

      // Enviar dados para a API
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar aplicação");
      }

      // Redirecionar para a lista de aplicações
      router.push("/applications");
      router.refresh(); // Atualizar a página para mostrar a nova aplicação
    } catch (err: any) {
      console.error("Erro ao criar aplicação:", err);
      setError(err.message || "Ocorreu um erro ao criar a aplicação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Aplicações
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Nova Aplicação</h1>
        <p className="text-gray-500 mt-1">
          Submeta sua aplicação para avaliação de usabilidade
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes da Aplicação</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Aplicação *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome da sua aplicação"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva brevemente sua aplicação"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://sua-app.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Aplicação</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange({ target: { name: "type", value } } as React.ChangeEvent<HTMLSelectElement> })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEB">Aplicação Web</SelectItem>
                  <SelectItem value="MOBILE">Aplicação Móvel</SelectItem>
                  <SelectItem value="DESKTOP">Aplicação Desktop</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/applications"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Salvando..." : "Criar Aplicação"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 