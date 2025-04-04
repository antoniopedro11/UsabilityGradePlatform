"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Template, TemplateStatus } from "@prisma/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Search, MoreVertical, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";

interface TemplateWithFormsCount extends Template {
  formsCount: number;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateWithFormsCount[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateWithFormsCount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateWithFormsCount | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = templates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchQuery, templates]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/templates");
      if (!response.ok) {
        throw new Error(`Erro ao carregar templates: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplates(data.templates);
      setFilteredTemplates(data.templates);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = (template: TemplateWithFormsCount) => {
    setTemplateToDelete(template);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    try {
      const response = await fetch(`/api/templates/${templateToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir template: ${response.status}`);
      }
      
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setFilteredTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
    } catch (error) {
      console.error("Erro ao excluir template:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setTemplateToDelete(null);
    }
  };

  const getStatusBadge = (status: TemplateStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500">Publicado</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline" className="text-gray-500">Arquivado</Badge>;
      default:
        return <Badge variant="secondary">Rascunho</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        <Button onClick={() => router.push("/dashboard/templates/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar templates..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={loadTemplates}>
          Atualizar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500 mb-4">Nenhum template encontrado</p>
            <Button onClick={() => router.push("/dashboard/templates/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Novo Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Gerencie seus templates de avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Formulários</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{template.title}</div>
                            {template.description && (
                              <div className="text-sm text-gray-500 truncate max-w-md">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(template.status)}</TableCell>
                        <TableCell>{template.formsCount}</TableCell>
                        <TableCell>{formatDate(template.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/templates/${template.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/templates/edit/${template.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTemplate(template)} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o template "{templateToDelete?.title}"?
              {templateToDelete && templateToDelete.formsCount > 0 && (
                <p className="text-red-500 mt-2">
                  Este template possui {templateToDelete.formsCount} formulário(s) associado(s). 
                  A exclusão não removerá os formulários, apenas a associação.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 