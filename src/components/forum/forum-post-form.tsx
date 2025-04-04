"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ForumPostFormProps {
  topicId: string;
}

export function ForumPostForm({ topicId }: ForumPostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao enviar resposta");
      }
      
      setContent("");
      toast({
        title: "Sucesso",
        description: "Sua resposta foi publicada.",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível publicar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite sua resposta aqui..."
        className="min-h-[150px]"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Resposta"}
        </Button>
      </div>
    </form>
  );
} 