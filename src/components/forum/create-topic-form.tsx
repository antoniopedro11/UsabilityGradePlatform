"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from "@/lib/utils";

// Esquema de validação para o novo tópico
const topicSchema = z.object({
  title: z
    .string()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres" })
    .max(100, { message: "O título pode ter no máximo 100 caracteres" }),
  content: z
    .string()
    .min(20, { message: "O conteúdo deve ter pelo menos 20 caracteres" })
    .max(10000, { message: "O conteúdo pode ter no máximo 10000 caracteres" }),
});

type TopicFormValues = z.infer<typeof topicSchema>;

interface CreateTopicFormProps {
  categoryId: string;
  categorySlug: string;
}

export function CreateTopicForm({ categoryId, categorySlug }: CreateTopicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Configuração do formulário
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Enviar o formulário
  const onSubmit = async (data: TopicFormValues) => {
    setIsSubmitting(true);

    try {
      // Gerar um slug a partir do título
      const slug = slugify(data.title);

      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          slug,
          categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao criar tópico");
      }

      const responseData = await response.json();

      toast({
        title: "Tópico criado",
        description: "Seu tópico foi criado com sucesso!",
      });

      // Redirecionar para o tópico recém-criado
      router.push(`/forum/${categorySlug}/${slug}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao criar tópico",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do seu tópico" {...field} />
              </FormControl>
              <FormDescription>
                Escolha um título claro e objetivo para o seu tópico.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva seu tópico em detalhes..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva seu tópico com detalhes para facilitar o entendimento e a discussão.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Tópico"}
        </Button>
      </form>
    </Form>
  );
} 