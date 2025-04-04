"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form as FormType, FormStatus, TemplateStatus } from "@prisma/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ArrowLeft, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormWithCount extends FormType {
  questionsCount: number;
}

interface TemplateData {
  id: string;
  title: string;
  description: string | null;
  status: TemplateStatus;
  createdAt: Date;
  updatedAt: Date;
  forms: FormWithCount[];
  formsCount: number;
}

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TemplateStatus>("DRAFT");
  const [availableForms, setAvailableForms] = useState<FormWithCount[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [originalForms, setOriginalForms] = useState<FormWithCount[]>([]);
  
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredForms, setFilteredForms] = useState<FormWithCount[]>([]);

  useEffect(() => {
    loadTemplate();
    loadForms();
  }, [id]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = availableForms.filter(form => 
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        form.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredForms(filtered);
    } else {
      setFilteredForms(availableForms);
    }
  }, [searchQuery, availableForms]);

  const loadTemplate = async () => {
    setIsLoadingTemplate(true);
    setError("");
    
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar template: ${response.status}`);
      }
      
      const data = await response.json();
      const template = data.template as TemplateData;
      
      // Preencher o formulário com os dados do template
      setTitle(template.title);
      setDescription(template.description || "");
      setStatus(template.status);
      
      // Guardar os formulários originais para referência
      setOriginalForms(template.forms);
      
      // Preencher os formulários selecionados
      setSelectedFormIds(template.forms.map(form => form.id));
    } catch (error) {
      console.error("Erro ao carregar template:", error);
      setError("Não foi possível carregar os detalhes do template.");
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const loadForms = async () => {
    setIsLoadingForms(true);
    try {
      const response = await fetch("/api/admin/forms");
      if (!response.ok) {
        throw new Error(`Erro ao carregar formulários: ${response.status}`);
      }
      
      const data = await response.json();
      const formsWithCount = data.forms.map((form: any) => ({
        ...form,
        questionsCount: form._count?.questions || 0
      }));
      
      setAvailableForms(formsWithCount);
      setFilteredForms(formsWithCount);
    } catch (error) {
      console.error("Erro ao carregar formulários:", error);
      setError("Não foi possível carregar os formulários disponíveis.");
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          status,
          forms: selectedFormIds
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Erro ao atualizar template: ${response.status}`);
      }
      
      setSuccess("Template atualizado com sucesso!");
      
      // Recarregar o template para obter os dados atualizados
      setTimeout(() => {
        router.push(`/dashboard/templates/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
      setError(error instanceof Error ? error.message : "Erro ao atualizar o template.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFormSelection = (formId: string) => {
    setSelectedFormIds(prev => 
      prev.includes(formId)
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const getStatusBadge = (status: FormStatus) => {
    return status === "PUBLISHED" 
      ? <Badge className="bg-green-500">Publicado</Badge>
      : <Badge variant="secondary">Rascunho</Badge>;
  };

  if (isLoadingTemplate) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600">Carregando template...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push(`/dashboard/templates/${id}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Template</h1>
        <p className="text-gray-500 mt-1">
          Modifique os detalhes do template e gerencie seus formulários
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-500 text-green-700">
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Template</CardTitle>
              <CardDescription>
                Atualize os detalhes do template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do template"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição opcional do template"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: TemplateStatus) => setStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Rascunho</SelectItem>
                      <SelectItem value="PUBLISHED">Publicado</SelectItem>
                      <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSubmitting || !title.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Formulários</CardTitle>
              <CardDescription>
                Gerencie os formulários incluídos neste template
              </CardDescription>
              
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar formulários..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingForms ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredForms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum formulário encontrado</p>
                  <Button variant="outline" className="mt-4" onClick={loadForms}>
                    Atualizar Lista
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Sel.</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Questões</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredForms.map((form) => (
                        <TableRow key={form.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => toggleFormSelection(form.id)}>
                          <TableCell>
                            <Checkbox
                              checked={selectedFormIds.includes(form.id)}
                              onCheckedChange={() => toggleFormSelection(form.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div>{form.title}</div>
                              {form.description && (
                                <div className="text-sm text-gray-500 truncate max-w-md">
                                  {form.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{form.category}</TableCell>
                          <TableCell>{getStatusBadge(form.status)}</TableCell>
                          <TableCell>{form.questionsCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-500">
                {selectedFormIds.length} formulário(s) selecionado(s)
              </div>
              <Button variant="outline" size="sm" onClick={loadForms}>
                Atualizar Lista
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 