"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  description?: string | null;
  url?: string | null;
  submitter?: {
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/applications');
        
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos:", data);
        setApplications(data.applications || []);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Aplicações</h1>
          <p className="text-gray-600">
            Gerencie suas aplicações enviadas para avaliação de usabilidade.
          </p>
        </div>
        <Link 
          href="/applications/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Nova Aplicação
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-md mb-3"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Nenhuma aplicação encontrada</h3>
          <p className="text-gray-500 mb-6">
            Você ainda não enviou nenhuma aplicação para avaliação de usabilidade.
          </p>
          <Link 
            href="/applications/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Enviar Nova Aplicação
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Data de Envio</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/applications/${app.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        {app.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/applications/${app.id}`}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          Ver
                        </Link>
                        <Link 
                          href={`/applications/${app.id}/edit`}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          Editar
                        </Link>
                      </div>
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