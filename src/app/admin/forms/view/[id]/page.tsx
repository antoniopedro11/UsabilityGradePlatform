"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Check, 
  Loader2,
  FileText,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Tipos
interface FormOption {
  id: string;
  text: string;
  order: number;
}

interface FormQuestion {
  id: string;
  text: string;
  description: string | null;
  type: string;
  required: boolean;
  order: number;
  options: FormOption[];
}

interface FormCreator {
  id: string;
  name: string;
  email: string;
}

interface FormDetails {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: FormCreator;
  questions: FormQuestion[];
}

export default function FormViewPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  
  const [form, setForm] = useState<FormDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificação de acesso de administrador
  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/check-auth");
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Erro na verificação:", response.status, data);
        return false;
      }
      
      // Verificar se o usuário está autenticado e tem role admin
      const isAuthenticated = data.isAuthenticated === true;
      const isAdmin = isAuthenticated && 
        (data.user?.role?.toLowerCase() === "admin" || 
         data.user?.role?.toUpperCase() === "ADMIN" ||
         data.user?.isAdmin === true);
      
      return isAdmin;
    } catch (error) {
      console.error("Erro ao verificar acesso de administrador:", error);
      return false;
    }
  };

  // Carregar dados do formulário
  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Verifica se tem acesso de administrador
        const hasAccess = await checkAdminAccess();
        
        if (!hasAccess) {
          setError("Você não tem permissão para acessar esta página.");
          setIsLoading(false);
          return;
        }
        
        // Buscar o formulário da API
        const response = await fetch(`/api/admin/forms/${formId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao carregar formulário");
        }
        
        const formData = await response.json();
        setForm(formData);
      } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        setError(error instanceof Error ? error.message : "Erro ao carregar o formulário");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (formId) {
      loadForm();
    }
  }, [formId]);

  // Excluir formulário
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/forms/${formId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir formulário");
      }
      
      const result = await response.json();
      setMessage({ type: "success", text: result.message || "Formulário excluído com sucesso" });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/admin/forms");
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir formulário:", error);
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Erro ao excluir o formulário" 
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter nome amigável da categoria
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      "web": "Interface Web",
      "mobile": "App Móvel",
      "desktop": "Aplicação Desktop",
      "ux": "Experiência do Usuário",
      "accessibility": "Acessibilidade",
      "other": "Outro"
    };
    
    return categories[categoryId] || categoryId;
  };

  // Obter nome amigável do status
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      "draft": "Rascunho",
      "published": "Publicado",
      "archived": "Arquivado"
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    const statusColor: Record<string, string> = {
      "draft": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      "published": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "archived": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    };
    
    return statusColor[status.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };
  
  // Obter nome amigável do tipo de pergunta
  const getQuestionTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      "text": "Texto Curto",
      "textarea": "Texto Longo",
      "number": "Número",
      "radio": "Escolha Única",
      "checkbox": "Múltipla Escolha",
      "select": "Seleção",
      "scale": "Escala",
      "date": "Data",
      "time": "Hora",
      "email": "E-mail",
      "file": "Arquivo"
    };
    
    return typeMap[type.toLowerCase()] || type;
  };

  // Mostrar mensagem de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500 dark:text-gray-400">Carregando formulário...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensagem de erro
  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle>Erro</CardTitle>
            </div>
            <CardDescription>Ocorreu um problema ao carregar o formulário</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/admin/forms")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Mostrar mensagem de formulário não encontrado
  if (!form) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              <CardTitle>Formulário não encontrado</CardTitle>
            </div>
            <CardDescription>Não foi possível encontrar o formulário solicitado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400">
              O formulário com o ID <span className="font-mono">{formId}</span> não foi encontrado ou não existe.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/admin/forms")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Mensagem de feedback */}
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" 
              ? <Check className="h-5 w-5" /> 
              : <AlertCircle className="h-5 w-5" />
            }
            <p>{message.text}</p>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Visualizar Formulário</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/admin/forms/edit/${form.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Detalhes do formulário */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{form.title}</CardTitle>
              <CardDescription>
                {form.description || "Sem descrição"}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(form.status)}>
              {getStatusName(form.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</h3>
              <p className="mt-1">{getCategoryName(form.category)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado por</h3>
              <p className="mt-1">{form.creator.name} ({form.creator.email})</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</h3>
              <p className="mt-1">{formatDate(form.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Última atualização</h3>
              <p className="mt-1">{formatDate(form.updatedAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de perguntas</h3>
              <p className="mt-1">{form.questions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de perguntas */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Perguntas</h2>
        
        {form.questions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Este formulário não possui perguntas.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {form.questions.sort((a, b) => a.order - b.order).map((question, index) => (
              <Card key={question.id} id={`question-${question.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-6">
                        {index + 1}
                      </Badge>
                      <CardTitle className="text-lg">{question.text}</CardTitle>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary">
                            {getQuestionTypeName(question.type)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tipo de pergunta: {getQuestionTypeName(question.type)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {question.description && (
                    <CardDescription>{question.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Mostrar opções da pergunta se existirem */}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Opções:
                      </h4>
                      <ul className="space-y-1 pl-5 list-disc text-sm">
                        {question.options
                          .sort((a, b) => a.order - b.order)
                          .map(option => (
                            <li key={option.id}>{option.text}</li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                  
                  {/* Badge para indicar se é obrigatória */}
                  <div className="mt-3">
                    {question.required ? (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Obrigatória
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Opcional
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir formulário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o formulário <span className="font-medium">"{form.title}"</span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 