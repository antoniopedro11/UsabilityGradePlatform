"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Schema de validação para o formulário
const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").max(500, "A descrição deve ter no máximo 500 caracteres"),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  type: z.string().min(1, "Selecione um tipo de aplicação"),
  screenshots: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Application {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  url?: string | null;
  status: string;
}

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState<Application>({
    id: "",
    name: "",
    description: "",
    type: "WEB",
    url: "",
    status: "Pendente",
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Aplicação não encontrada");
          }
          throw new Error(`Erro ao carregar aplicação: ${response.status}`);
        }
        
        const data = await response.json();
        setFormData({
          id: data.application.id,
          name: data.application.name,
          description: data.application.description || "",
          type: data.application.type,
          url: data.application.url || "",
          status: data.application.status,
        });
      } catch (err: any) {
        console.error("Erro ao carregar aplicação:", err);
        setError(err.message || "Ocorreu um erro ao carregar a aplicação");
      } finally {
        setLoading(false);
      }
    }
    
    fetchApplication();
  }, [id]);
  
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
    setSubmitting(true);
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
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar aplicação");
      }
      
      // Redirecionar para a página de detalhes da aplicação
      router.push(`/applications/${id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar aplicação:", err);
      setError(err.message || "Ocorreu um erro ao atualizar a aplicação");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <Link href="/applications" className="text-indigo-600 hover:text-indigo-900">
            Voltar para Lista de Aplicações
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Aplicação</h1>
        <p className="text-gray-600">
          Atualize os detalhes da aplicação abaixo.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Aplicação *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Aplicação *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="WEB">Aplicação Web</option>
            <option value="MOBILE">Aplicação Mobile</option>
            <option value="DESKTOP">Aplicação Desktop</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL da Aplicação
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://exemplo.com"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <Link
            href={`/applications/${id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
} 