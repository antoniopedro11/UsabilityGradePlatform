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

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Inicializar o formulário com o hook useForm e o resolver zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      type: "WEB",
      screenshots: "",
    },
  });

  // Carregar os dados da aplicação ao montar o componente
  useEffect(() => {
    const fetchApplicationData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/applications/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Aplicação não encontrada");
          } else if (response.status === 401) {
            throw new Error("Você não tem permissão para editar esta aplicação");
          } else {
            throw new Error("Erro ao buscar detalhes da aplicação");
          }
        }
        
        const data = await response.json();
        const app = data.application;
        
        // Atualizar os valores do formulário
        form.reset({
          name: app.name,
          description: app.description || "",
          url: app.url || "",
          type: app.type,
          screenshots: app.screenshots || "",
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes da aplicação:", error);
        setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicationData();
  }, [id, form]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar aplicação");
      }
      
      toast({
        title: "Aplicação atualizada com sucesso!",
        description: "As alterações foram salvas.",
      });
      
      // Redirecionar para a página de detalhes da aplicação
      router.push(`/applications/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar aplicação:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
      
      toast({
        title: "Erro ao atualizar aplicação",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-xl">Carregando dados da aplicação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/applications/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Detalhes
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Aplicação</h1>
        <p className="text-gray-500 mt-1">
          Atualize os detalhes da sua aplicação
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes da Aplicação</CardTitle>
          <CardDescription>
            Edite os detalhes sobre a aplicação que você enviou para avaliação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Aplicação</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da aplicação" {...field} />
                    </FormControl>
                    <FormDescription>
                      O nome pelo qual sua aplicação é conhecida
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva sua aplicação e o que você gostaria de avaliar" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Forneça uma descrição detalhada da aplicação e quais aspectos você gostaria que fossem avaliados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Aplicação</FormLabel>
                    <FormControl>
                      <Input placeholder="https://sua-aplicacao.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link para acessar sua aplicação (opcional para aplicações desktop)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Aplicação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de aplicação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEB">Web</SelectItem>
                        <SelectItem value="MOBILE">Mobile</SelectItem>
                        <SelectItem value="DESKTOP">Desktop</SelectItem>
                        <SelectItem value="OTHER">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      O tipo principal da sua aplicação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="screenshots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screenshots (URLs)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="https://imagem1.com, https://imagem2.com" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      URLs de screenshots separadas por vírgula (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/applications/${id}`}>
                    Cancelar
                  </Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 