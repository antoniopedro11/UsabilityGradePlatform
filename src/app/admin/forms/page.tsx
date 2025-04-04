"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Check, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipos
interface Form {
  id: string;
  title: string;
  description: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  status: string;
}

export default function FormsManagementPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [filteredForms, setFilteredForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [apiDebugInfo, setApiDebugInfo] = useState<{
    status?: number;
    statusText?: string;
    data?: any;
    authResponse?: {
      status: number;
      data: any;
      isAuthenticated?: boolean;
      isAdmin?: boolean;
    };
    authError?: {
      message: string;
    };
  } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificação de acesso de administrador
  const checkAdminAccess = async () => {
    try {
      console.log("Verificando acesso de administrador...");
      const response = await fetch("/api/check-auth");
      const data = await response.json();
      
      console.log("Resposta completa da verificação:", data);
      
      if (!response.ok) {
        console.log("Erro na verificação:", response.status, data);
        setApiDebugInfo(prev => ({
          ...(prev || {}),
          authResponse: {
            status: response.status,
            data: data
          }
        }));
        return false;
      }
      
      // Verificar se o usuário está autenticado e tem role admin
      const isAuthenticated = data.isAuthenticated === true;
      const isAdmin = isAuthenticated && 
        (data.user?.role?.toLowerCase() === "admin" || 
         data.user?.role?.toUpperCase() === "ADMIN" ||
         data.user?.isAdmin === true);
      
      console.log("Usuário autenticado?", isAuthenticated);
      console.log("Papel do usuário:", data.user?.role);
      console.log("É admin?", isAdmin);
      
      setApiDebugInfo(prev => ({
        ...(prev || {}),
        authResponse: {
          status: response.status,
          data: data,
          isAuthenticated: isAuthenticated,
          isAdmin: isAdmin
        }
      }));
      
      return isAdmin;
    } catch (error) {
      console.error("Erro ao verificar acesso de administrador:", error);
      setApiDebugInfo(prev => ({
        ...(prev || {}),
        authError: {
          message: error instanceof Error ? error.message : String(error)
        }
      }));
      return false;
    }
  };

  // Carregar formulários
  const loadForms = async () => {
    setIsLoading(true);
    setError(null);
    setApiDebugInfo(null);
    
    try {
      // Verifica se tem acesso de administrador
      const hasAccess = await checkAdminAccess();
      console.log("Tem acesso de administrador?", hasAccess);
      
      if (!hasAccess) {
        setError("Você não tem permissão para acessar esta página.");
        setIsLoading(false);
        return;
      }
      
      // Buscar formulários da API
      console.log("Buscando formulários da API...");
      const response = await fetch("/api/admin/forms");
      const responseData = await response.json();
      console.log("Resposta da API:", responseData);
      
      // Salvar informações de depuração
      setApiDebugInfo({
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      if (!response.ok) {
        setError(`Erro ao carregar formulários: ${responseData.error || 'Erro desconhecido'}`);
        setIsLoading(false);
        return;
      }
      
      // Usar os dados da API diretamente
      if (responseData.forms && Array.isArray(responseData.forms)) {
        console.log("Formulários encontrados:", responseData.forms.length);
        setForms(responseData.forms);
        setFilteredForms(responseData.forms);
      } else {
        console.log("Nenhum formulário encontrado na API");
        setForms([]);
        setFilteredForms([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar formulários:", error);
      setError("Ocorreu um erro ao carregar os formulários. Tente novamente.");
      setIsLoading(false);
    }
  };

  // Filtrar formulários pelo termo de busca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredForms(forms);
      return;
    }
    
    const filtered = forms.filter(form => 
      form.title.toLowerCase().includes(query.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(query.toLowerCase())) ||
      form.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredForms(filtered);
  };

  // Ações para os formulários
  const handlePreview = (formId: string) => {
    router.push(`/admin/forms/preview/${formId}`);
  };

  const handleEdit = (formId: string) => {
    router.push(`/admin/forms/edit/${formId}`);
  };

  const confirmDelete = (form: Form) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setFormToDelete(null);
    setShowDeleteModal(false);
  };

  const deleteForm = async () => {
    if (!formToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Realizar chamada real à API para excluir o formulário
      const response = await fetch(`/api/admin/forms/${formToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao excluir formulário");
      }
      
      // Atualizar a lista de formulários apenas se a exclusão for bem-sucedida
      setForms(prevForms => prevForms.filter(form => form.id !== formToDelete.id));
      setFilteredForms(prevForms => prevForms.filter(form => form.id !== formToDelete.id));
      
      setShowDeleteModal(false);
      setFormToDelete(null);
      setMessage({
        type: "success",
        text: responseData.message || "Formulário excluído com sucesso!"
      });
      
      // Limpar a mensagem após alguns segundos
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Erro ao excluir formulário:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao excluir formulário. Tente novamente."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Carregar formulários ao montar o componente
  useEffect(() => {
    loadForms();
  }, []);

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  // Traduzir categoria
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      web: "Web",
      mobile: "Mobile",
      desktop: "Desktop",
      accessibility: "Acessibilidade",
      usability: "Usabilidade",
      ux: "Experiência do Utilizador"
    };
    
    return categories[categoryId] || categoryId;
  };

  // Traduzir status
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: "Rascunho",
      published: "Publicado",
      archived: "Arquivado"
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  // Cor do status
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      draft: "text-amber-400 bg-amber-900/30",
      published: "text-green-400 bg-green-900/30",
      archived: "text-gray-400 bg-gray-700/50"
    };
    
    return statusColors[status.toLowerCase()] || "text-gray-400 bg-gray-700/50";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Formulários de Avaliação</h1>
          <p className="text-gray-400 mt-1">
            Gerenciar formulários de avaliação de usabilidade
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/admin/forms/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Formulário
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mensagem de sucesso/erro */}
      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === "success" 
              ? "bg-green-900/30 border border-green-800 text-green-300" 
              : "bg-red-900/30 border border-red-800 text-red-300"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{message.text}</p>
          </div>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Informações de depuração da API */}
      {apiDebugInfo && (
        <div className="bg-gray-900/50 border border-gray-700 text-gray-300 p-4 rounded-md mb-6">
          <details>
            <summary className="cursor-pointer font-medium">Informações de depuração da API</summary>
            <div className="mt-2 text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(apiDebugInfo, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
      
      {/* Barra de pesquisa */}
      <div className="bg-gray-800 border border-gray-700 rounded-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar formulários..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
      </div>
      
      {/* Lista de formulários */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-400">Carregando formulários...</span>
        </div>
      ) : filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredForms.map(form => (
            <div key={form.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {form.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {form.description || "Sem descrição"}
                    </p>
                  </div>
                  <Badge className={getStatusColor(form.status)}>
                    {getStatusName(form.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <span className="font-medium mr-1">Categoria:</span>
                    {getCategoryName(form.category)}
                  </div>
                  <div>
                    <span className="font-medium mr-1">Perguntas:</span>
                    {form.questionCount}
                  </div>
                  <div>
                    <span className="font-medium mr-1">Criado em:</span>
                    {formatDate(form.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium mr-1">Atualizado em:</span>
                    {formatDate(form.updatedAt)}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(form.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(form.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                    onClick={() => confirmDelete(form)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-8 text-center">
          <p className="text-gray-400">
            {searchQuery 
              ? `Nenhum formulário encontrado para "${searchQuery}"`
              : "Nenhum formulário disponível. Crie seu primeiro formulário!"}
          </p>
          {!searchQuery && (
            <Link href="/admin/forms/new">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Criar Formulário
              </Button>
            </Link>
          )}
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && formToDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tem certeza de que deseja excluir o formulário <strong>"{formToDelete.title}"</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={deleteForm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
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
            </div>
          </div>
        </div>
      )}
      
      {/* Botão para recarregar formulários */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={loadForms}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Loader2 className="h-4 w-4 mr-2" />
          Recarregar Formulários
        </Button>
      </div>
    </div>
  );
} 