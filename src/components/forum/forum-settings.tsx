"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const generalSettingsSchema = z.object({
  forumTitle: z.string().min(3, {
    message: "O título do fórum deve ter pelo menos 3 caracteres.",
  }),
  forumDescription: z.string().min(10, {
    message: "A descrição do fórum deve ter pelo menos 10 caracteres.",
  }),
  topicsPerPage: z.coerce.number().int().min(5).max(50),
  allowGuestViewing: z.boolean(),
  requireApproval: z.boolean(),
});

const postingRulesSchema = z.object({
  minPostLength: z.coerce.number().int().min(10).max(1000),
  maxPostLength: z.coerce.number().int().min(100).max(10000),
  allowFileAttachments: z.boolean(),
  allowImages: z.boolean(),
  allowLinks: z.boolean(),
  linkPostingLevel: z.string(),
});

const forumRulesSchema = z.object({
  rulesContent: z.string().min(50, {
    message: "As regras do fórum devem ter pelo menos 50 caracteres.",
  }),
  showRulesNewUsers: z.boolean(),
  requireRulesAcceptance: z.boolean(),
});

export function ForumSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Formulário para configurações gerais
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      forumTitle: "Fórum de Usabilidade",
      forumDescription: "Discuta tópicos relacionados a usabilidade, experiência do usuário e design de interfaces.",
      topicsPerPage: 20,
      allowGuestViewing: true,
      requireApproval: false,
    },
  });

  // Formulário para regras de postagem
  const postingForm = useForm<z.infer<typeof postingRulesSchema>>({
    resolver: zodResolver(postingRulesSchema),
    defaultValues: {
      minPostLength: 50,
      maxPostLength: 5000,
      allowFileAttachments: false,
      allowImages: true,
      allowLinks: true,
      linkPostingLevel: "all",
    },
  });

  // Formulário para regras do fórum
  const rulesForm = useForm<z.infer<typeof forumRulesSchema>>({
    resolver: zodResolver(forumRulesSchema),
    defaultValues: {
      rulesContent: "1. Seja respeitoso com todos os membros.\n2. Não faça spam ou publicidade não autorizada.\n3. Mantenha as discussões relacionadas aos tópicos de usabilidade.\n4. Não compartilhe conteúdo protegido por direitos autorais.\n5. Respeite a privacidade de outros usuários.",
      showRulesNewUsers: true,
      requireRulesAcceptance: true,
    },
  });

  function onSubmitGeneral(values: z.infer<typeof generalSettingsSchema>) {
    toast({
      title: "Configurações gerais salvas",
      description: "As configurações gerais do fórum foram atualizadas com sucesso.",
    });
    console.log(values);
  }

  function onSubmitPosting(values: z.infer<typeof postingRulesSchema>) {
    toast({
      title: "Regras de postagem salvas",
      description: "As regras de postagem do fórum foram atualizadas com sucesso.",
    });
    console.log(values);
  }

  function onSubmitRules(values: z.infer<typeof forumRulesSchema>) {
    toast({
      title: "Regras do fórum salvas",
      description: "As regras do fórum foram atualizadas com sucesso.",
    });
    console.log(values);
  }

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="posting">Postagem</TabsTrigger>
        <TabsTrigger value="rules">Regras</TabsTrigger>
      </TabsList>
      
      {/* Configurações Gerais */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Configure os parâmetros gerais do fórum de discussão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                <FormField
                  control={generalForm.control}
                  name="forumTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Fórum</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o título principal que aparecerá no topo do fórum.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="forumDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Fórum</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Esta descrição aparecerá na página principal do fórum.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalForm.control}
                  name="topicsPerPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tópicos por Página</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de tópicos exibidos por página (entre 5 e 50).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={generalForm.control}
                    name="allowGuestViewing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Permitir Visualização de Visitantes
                          </FormLabel>
                          <FormDescription>
                            Usuários não logados podem visualizar o fórum.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="requireApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Aprovação de Tópicos
                          </FormLabel>
                          <FormDescription>
                            Novos tópicos precisam de aprovação de moderadores.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit">Salvar Configurações Gerais</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Regras de Postagem */}
      <TabsContent value="posting">
        <Card>
          <CardHeader>
            <CardTitle>Regras de Postagem</CardTitle>
            <CardDescription>
              Configure as regras para criação de tópicos e respostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...postingForm}>
              <form onSubmit={postingForm.handleSubmit(onSubmitPosting)} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={postingForm.control}
                    name="minPostLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho Mínimo de Postagem</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número mínimo de caracteres para tópicos e respostas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={postingForm.control}
                    name="maxPostLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho Máximo de Postagem</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número máximo de caracteres para tópicos e respostas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={postingForm.control}
                    name="allowFileAttachments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Permitir Anexos
                          </FormLabel>
                          <FormDescription>
                            Usuários podem anexar arquivos às postagens.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={postingForm.control}
                    name="allowImages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Permitir Imagens
                          </FormLabel>
                          <FormDescription>
                            Usuários podem incorporar imagens em postagens.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={postingForm.control}
                  name="allowLinks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Permitir Links
                        </FormLabel>
                        <FormDescription>
                          Usuários podem incluir links em postagens.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={postingForm.control}
                  name="linkPostingLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quem pode postar links</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione quem pode postar links" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Todos os usuários</SelectItem>
                          <SelectItem value="verified">Apenas usuários verificados</SelectItem>
                          <SelectItem value="trusted">Apenas usuários confiáveis</SelectItem>
                          <SelectItem value="admin">Apenas administradores</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Define quais usuários podem incluir links em suas postagens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Salvar Regras de Postagem</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Regras do Fórum */}
      <TabsContent value="rules">
        <Card>
          <CardHeader>
            <CardTitle>Regras do Fórum</CardTitle>
            <CardDescription>
              Configure as regras e termos de uso do fórum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...rulesForm}>
              <form onSubmit={rulesForm.handleSubmit(onSubmitRules)} className="space-y-6">
                <FormField
                  control={rulesForm.control}
                  name="rulesContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo das Regras</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={10}
                          placeholder="Digite as regras do fórum aqui..."
                        />
                      </FormControl>
                      <FormDescription>
                        Este texto será exibido como regras oficiais do fórum.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={rulesForm.control}
                    name="showRulesNewUsers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mostrar Regras para Novos Usuários
                          </FormLabel>
                          <FormDescription>
                            Exibir regras automaticamente ao primeiro acesso.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={rulesForm.control}
                    name="requireRulesAcceptance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Exigir Aceitação das Regras
                          </FormLabel>
                          <FormDescription>
                            Usuários devem aceitar as regras antes de postar.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit">Salvar Regras do Fórum</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 