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
  description?: string | null;
  type: string;
  url?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Aplicação não encontrada");
          }
          throw new Error(`Erro ao carregar aplicação: ${response.status}`);
        }
        
        const data = await response.json();
        setApplication(data.application);
      } catch (err: any) {
        console.error("Erro ao carregar aplicação:", err);
        setError(err.message || "Ocorreu um erro ao carregar a aplicação");
      } finally {
        setLoading(false);
      }
    }
    
    fetchApplication();
  }, [id]);
  
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta aplicação?")) {
      return;
    }
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir aplicação");
      }
      
      router.push("/applications");
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao excluir aplicação:", err);
      setError(err.message || "Ocorreu um erro ao excluir a aplicação");
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <Link href="/applications" className="text-indigo-600 hover:text-indigo-900">
            Voltar para Lista de Aplicações
          </Link>
        </div>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Aplicação não encontrada</p>
        </div>
        <div className="mt-4">
          <Link href="/applications" className="text-indigo-600 hover:text-indigo-900">
            Voltar para Lista de Aplicações
          </Link>
        </div>
      </div>
    );
  }
  
  // Função auxiliar para formatar data
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
  
  // Mapear status para badges coloridos
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      'Pendente': { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      'Em Análise': { color: 'bg-blue-100 text-blue-800', label: 'Em Análise' },
      'Aprovado': { color: 'bg-green-100 text-green-800', label: 'Aprovado' },
      'Rejeitado': { color: 'bg-red-100 text-red-800', label: 'Rejeitado' }
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`${statusInfo.color} px-2 py-1 rounded-full text-xs font-medium`}>
        {statusInfo.label}
      </span>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{application.name}</h1>
        <div className="flex space-x-3">
          <Link 
            href={`/applications/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Editar
          </Link>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition ${
              deleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Detalhes da Aplicação</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(application.status)}</div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="mt-1">{application.type}</p>
              </div>
              
              {application.url && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">URL</p>
                  <a 
                    href={application.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-indigo-600 hover:text-indigo-900 break-all"
                  >
                    {application.url}
                  </a>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Enviado por</p>
                <p className="mt-1">{application.submitter.name || application.submitter.email}</p>
              </div>
              
              {application.reviewer && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Revisor</p>
                  <p className="mt-1">{application.reviewer.name || application.reviewer.email}</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Datas</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="mt-1">{formatDate(application.createdAt)}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Última atualização</p>
                <p className="mt-1">{formatDate(application.updatedAt)}</p>
              </div>
              
              <h2 className="text-lg font-semibold mb-2 mt-6">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {application.description || "Nenhuma descrição fornecida."}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Link href="/applications" className="text-indigo-600 hover:text-indigo-900">
          &larr; Voltar para Lista de Aplicações
        </Link>
      </div>
    </div>
  );
} 