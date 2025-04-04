"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash, ArrowLeft, ExternalLink, Calendar, Tag, Clock, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  type: string;
  status: string;
  screenshots: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Buscar detalhes da aplicação ao carregar a página
  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Aplicação não encontrada");
        } else if (response.status === 401) {
          throw new Error("Você não tem permissão para acessar esta aplicação");
        } else {
          throw new Error("Erro ao buscar detalhes da aplicação");
        }
      }
      
      const data = await response.json();
      setApplication(data.application);
    } catch (error) {
      console.error("Erro ao buscar detalhes da aplicação:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir aplicação");
      }
      
      toast({
        title: "Aplicação excluída com sucesso",
        description: "A aplicação foi removida permanentemente.",
      });
      
      router.push("/applications");
      router.refresh();
    } catch (error) {
      console.error("Erro ao excluir aplicação:", error);
      toast({
        title: "Erro ao excluir aplicação",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "IN_REVIEW":
        return "info";
      default:
        return "secondary";
    }
  };

  // Renderizar badges traduzidos para o status
  const renderStatusBadge = (status: string) => {
    const statusLabels: Record<string, string> = {
      "PENDING": "Pendente",
      "APPROVED": "Aprovado",
      "REJECTED": "Rejeitado",
      "IN_REVIEW": "Em Análise"
    };
    
    return (
      <Badge variant={getStatusBadgeVariant(status) as "warning" | "success" | "destructive" | "info" | "secondary"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  // Renderizar o tipo de aplicação
  const renderApplicationType = (type: string) => {
    const typeLabels: Record<string, string> = {
      "WEB": "Web",
      "MOBILE": "Mobile",
      "DESKTOP": "Desktop",
      "OTHER": "Outro"
    };
    
    return typeLabels[type] || type;
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Renderizar screenshots se existirem
  const renderScreenshots = () => {
    if (!application?.screenshots) return null;
    
    const urls = application.screenshots.split(",").map(url => url.trim()).filter(Boolean);
    
    if (urls.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Screenshots</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {urls.map((url, index) => (
            <a 
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-md border border-gray-200 transition-all hover:shadow-md"
            >
              <img 
                src={url} 
                alt={`Screenshot ${index + 1}`} 
                className="w-full h-auto"
                onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Imagem+não+disponível")} 
              />
            </a>
          ))}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-xl">Carregando detalhes da aplicação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/applications">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Aplicações
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Aplicação não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Não foi possível encontrar a aplicação solicitada.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/applications">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Aplicações
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Aplicações
          </Link>
        </Button>
      </div>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{application.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {renderStatusBadge(application.status)}
            <span className="text-gray-500">
              Enviado em {formatDate(application.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/applications/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a aplicação.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, excluir"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Aplicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{application.description || "Sem descrição"}</p>
              </div>
              
              {application.url && (
                <div>
                  <h3 className="text-lg font-medium mb-2">URL</h3>
                  <a 
                    href={application.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {application.url}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              )}
              
              {renderScreenshots()}
              
              {application.feedback && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Feedback</h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.feedback}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{renderStatusBadge(application.status)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p>{renderApplicationType(application.type)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-gray-500">Enviado por</p>
                <p>{application.submitter.name || application.submitter.email}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-gray-500">Data de Envio</p>
                <p>{formatDate(application.createdAt)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-gray-500">Última Atualização</p>
                <p>{formatDate(application.updatedAt)}</p>
              </div>
              
              {application.reviewer && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Revisor</p>
                    <p>{application.reviewer.name || application.reviewer.email}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 