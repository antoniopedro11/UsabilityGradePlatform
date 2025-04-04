"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

// Esquema de validação para a resposta
const responseSchema = z.object({
  content: z
    .string()
    .min(10, { message: "A resposta deve ter pelo menos 10 caracteres" })
    .max(5000, { message: "A resposta pode ter no máximo 5000 caracteres" }),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface CreateResponseFormProps {
  topicId: string;
}

export function CreateResponseForm({ topicId }: CreateResponseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
        }
      }
    }
  }, []);

  // Configuração do formulário
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      content: "",
    },
  });

  // Enviar o formulário
  const onSubmit = async (data: ResponseFormValues) => {
    setIsSubmitting(true);

    try {
      // Verificar se há dados do usuário
      if (!userData || !userData.id) {
        throw new Error("Você precisa estar logado para enviar uma resposta");
      }

      // Usar a rota simplificada que criamos
      const response = await fetch("/api/forum/post-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topicId,
          content: data.content,
          userId: userData.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao enviar resposta");
      }

      // Limpar o formulário e mostrar mensagem de sucesso
      form.reset();
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso!",
      });

      // Atualizar a página para mostrar a nova resposta
      router.refresh();
      
      // Forçar um recarregamento da página para mostrar o novo comentário
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao enviar resposta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Escreva sua resposta aqui..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Resposta"}
        </Button>
      </form>
    </Form>
  );
} 