"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { TemplateStatus } from "@prisma/client";

const templateSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    required_error: "Por favor, selecione um status",
  }),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "DRAFT",
    },
  });

  // Carregar os dados do template
  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/templates/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Template não encontrado");
          } else {
            setError(`Erro ao carregar o template: ${response.status}`);
          }
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        const template = data.template;
        
        form.reset({
          title: template.title,
          description: template.description || "",
          status: template.status as TemplateStatus,
        });
      } catch (error) {
        console.error("Erro ao carregar o template:", error);
        setError("Ocorreu um erro ao carregar o template. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [params.id, form]);

  const onSubmit = async (data: TemplateFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/templates/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar template");
      }

      router.push(`/admin/templates/${params.id}`);
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o template");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push(`/admin/templates/${params.id}`)}
          className="text-gray-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Template</h1>
        <p className="text-gray-500 mt-2">
          Atualize as informações do template conforme necessário.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Rascunho</SelectItem>
                          <SelectItem value="PUBLISHED">Publicado</SelectItem>
                          <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push(`/admin/templates/${params.id}`)}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
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
      )}
    </div>
  );
} 