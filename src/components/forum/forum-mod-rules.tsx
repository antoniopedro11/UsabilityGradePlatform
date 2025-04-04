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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const moderationRulesSchema = z.object({
  enableAutoModeration: z.boolean(),
  profanityFilter: z.boolean(),
  spamDetection: z.boolean(),
  maxReportsThreshold: z.coerce.number().int().min(1).max(100),
  autoModActions: z.string(),
  keywordFilterEnabled: z.boolean(),
  newUserRestrictions: z.boolean(),
  newUserProbationDays: z.coerce.number().int().min(1).max(30),
  customKeyword: z.string().min(2).max(30).optional(),
});

export function ForumModRules() {
  const { toast } = useToast();
  const [filteredKeywords, setFilteredKeywords] = useState<string[]>([
    "palavrão", "ofensa", "spam", "propaganda"
  ]);
  const [newKeyword, setNewKeyword] = useState("");
  
  const form = useForm<z.infer<typeof moderationRulesSchema>>({
    resolver: zodResolver(moderationRulesSchema),
    defaultValues: {
      enableAutoModeration: true,
      profanityFilter: true,
      spamDetection: true,
      maxReportsThreshold: 5,
      autoModActions: "flag",
      keywordFilterEnabled: true,
      newUserRestrictions: true,
      newUserProbationDays: 7,
    },
  });

  function onSubmit(values: z.infer<typeof moderationRulesSchema>) {
    console.log({ ...values, filteredKeywords });
    toast({
      title: "Regras de moderação salvas",
      description: "As regras de moderação automática foram atualizadas com sucesso.",
    });
  }

  const addKeyword = () => {
    if (newKeyword && newKeyword.length >= 2 && !filteredKeywords.includes(newKeyword)) {
      setFilteredKeywords([...filteredKeywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFilteredKeywords(filteredKeywords.filter(k => k !== keyword));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regras de Moderação Automática</CardTitle>
        <CardDescription>
          Configure as regras para moderação automática do conteúdo do fórum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enableAutoModeration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Ativar Moderação Automática
                    </FormLabel>
                    <FormDescription>
                      Permite que o sistema modere automaticamente conteúdos com base nas regras.
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

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="profanityFilter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Filtro de Palavrões
                      </FormLabel>
                      <FormDescription>
                        Detecta e filtra linguagem imprópria automaticamente.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("enableAutoModeration")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spamDetection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Detecção de Spam
                      </FormLabel>
                      <FormDescription>
                        Identifica postagens repetitivas ou com muitos links.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("enableAutoModeration")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxReportsThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Denúncias</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      disabled={!form.watch("enableAutoModeration")} 
                    />
                  </FormControl>
                  <FormDescription>
                    Número de denúncias para marcar um conteúdo para revisão (1-100).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoModActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Automática</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!form.watch("enableAutoModeration")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flag">Apenas Sinalizar</SelectItem>
                      <SelectItem value="hide">Ocultar até Revisão</SelectItem>
                      <SelectItem value="delete">Remover Automaticamente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Ação a ser tomada quando um conteúdo viola as regras.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywordFilterEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Filtro de Palavras-chave
                    </FormLabel>
                    <FormDescription>
                      Filtra conteúdo que contenha palavras-chave específicas.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch("enableAutoModeration")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("keywordFilterEnabled") && form.watch("enableAutoModeration") && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex flex-wrap gap-2">
                  {filteredKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="px-3 py-1">
                      {keyword}
                      <button 
                        type="button" 
                        onClick={() => removeKeyword(keyword)} 
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar palavra-chave"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addKeyword} variant="secondary">
                    Adicionar
                  </Button>
                </div>
                <FormDescription>
                  Palavras-chave que serão detectadas pelo filtro de conteúdo.
                </FormDescription>
              </div>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="newUserRestrictions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Restrições para Novos Usuários
                      </FormLabel>
                      <FormDescription>
                        Aplica restrições especiais para novos usuários.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("enableAutoModeration")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("newUserRestrictions") && form.watch("enableAutoModeration") && (
                <FormField
                  control={form.control}
                  name="newUserProbationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Teste (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dias que um novo usuário terá restrições (1-30).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button type="submit">Salvar Regras de Moderação</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 