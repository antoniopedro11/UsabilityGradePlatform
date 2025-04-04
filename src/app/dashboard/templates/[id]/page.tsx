"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Template, TemplateStatus, Form, FormStatus } from "@prisma/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ArrowLeft, Edit, Eye, Loader2, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormWithQuestionsCount extends Form {
  questionsCount: number;
}

interface TemplateWithForms extends Template {
  forms: FormWithQuestionsCount[];
  formsCount: number;
}

export default function TemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [template, setTemplate] = useState<TemplateWithForms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar template: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplate(data.template);
    } catch (error) {
      console.error("Erro ao carregar template:", error);
      setError("Não foi possível carregar os detalhes do template.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir template: ${response.status}`);
      }
      
      // Redirecionar após exclusão bem-sucedida
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Erro ao excluir template:", error);
      setError("Não foi possível excluir o template.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status: TemplateStatus | FormStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500">Publicado</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline" className="text-gray-500">Arquivado</Badge>;
      default:
        return <Badge variant="secondary">Rascunho</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600">Carregando template...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => router.push("/dashboard/templates")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => router.push("/dashboard/templates")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-lg text-gray-500">Template não encontrado</p>
              <Button onClick={() => router.push("/dashboard/templates")} className="mt-4">
                Voltar para Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.push("/dashboard/templates")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.title}</h1>
            {template.description && (
              <p className="text-gray-500 mt-1 max-w-2xl">{template.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/templates/edit/${id}`)}
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            onClick={() => setDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Template</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{getStatusBadge(template.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Formulários</dt>
                <dd className="mt-1 text-xl font-semibold">{template.formsCount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="mt-1">{formatDate(template.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                <dd className="mt-1">{formatDate(template.updatedAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Formulários no Template</CardTitle>
            <CardDescription>
              Formulários de avaliação incluídos neste template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {template.forms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum formulário adicionado a este template</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.push(`/dashboard/templates/edit/${id}`)}
                >
                  Adicionar Formulários
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-400px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Questões</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.forms.map((form) => (
                      <TableRow key={form.id}>
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
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/admin/forms/view/${form.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o template 
              <span className="font-semibold"> {template.title}</span>.
              
              {template.formsCount > 0 && (
                <p className="mt-2 text-red-500">
                  Este template possui {template.formsCount} formulário(s) associado(s).
                  A exclusão não removerá os formulários, apenas a associação.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 