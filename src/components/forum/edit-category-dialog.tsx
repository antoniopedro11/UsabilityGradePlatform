"use client";

import { useState, ReactNode } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Esquema de validação para edição de categoria
const editCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(50, { message: "O nome pode ter no máximo 50 caracteres" }),
  description: z
    .string()
    .max(500, { message: "A descrição pode ter no máximo 500 caracteres" })
    .optional()
    .nullable(),
  slug: z
    .string()
    .min(3, { message: "O slug deve ter pelo menos 3 caracteres" })
    .max(50, { message: "O slug pode ter no máximo 50 caracteres" })
    .regex(/^[a-z0-9-]+$/, {
      message: "O slug deve conter apenas letras minúsculas, números e hífens",
    }),
  order: z
    .number()
    .int()
    .min(0, { message: "A ordem deve ser um número positivo" }),
});

type CategoryFormValues = z.infer<typeof editCategorySchema>;

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
}

interface EditCategoryDialogProps {
  children: ReactNode;
  category: Category;
  onSuccess?: () => void;
}

export function EditCategoryDialog({
  children,
  category,
  onSuccess,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Configuração do formulário
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      slug: category.slug,
      order: category.order,
    },
  });

  // Gerar slug a partir do nome
  const handleNameChange = (name: string) => {
    const slug = slugify(name);
    form.setValue("slug", slug);
  };

  // Enviar o formulário
  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forum/categories?id=${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar categoria");
      }

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      });

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao atualizar categoria",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da categoria do fórum.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome da categoria"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome para identificar a categoria no fórum.
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
                      placeholder="Descrição da categoria"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma breve descrição do conteúdo da categoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-da-categoria" {...field} />
                  </FormControl>
                  <FormDescription>
                    O slug é usado na URL da categoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Define a ordem de exibição da categoria no fórum.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 