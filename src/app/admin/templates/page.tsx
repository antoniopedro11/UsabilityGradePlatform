"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Template, TemplateStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash, Eye } from "lucide-react";
import Link from "next/link";

interface TemplateWithFormsCount extends Template {
  formsCount: number;
}

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateWithFormsCount[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateWithFormsCount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir template: ${response.status}`);
      }
      
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setFilteredTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (error) {
      console.error("Erro ao excluir template:", error);
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        <Button onClick={() => router.push("/admin/templates/new")}>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-lg text-gray-500 mb-4">Nenhum template encontrado</p>
          <Button onClick={() => router.push("/admin/templates/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Template
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Formulários</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Criado em</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{template.title}</div>
                        {template.description && (
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {template.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(template.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {template.formsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(template.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push(`/admin/templates/${template.id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/templates/edit/${template.id}`)}
                        className="text-amber-600 hover:text-amber-800 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 