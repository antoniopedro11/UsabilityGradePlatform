"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  RefreshCcw,
  ArrowUpDown,
  Laptop,
  Smartphone,
  MonitorIcon,
  FileQuestion
} from "lucide-react";

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
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Aplicar filtros aos dados
    let filtered = [...applications];
    
    // Filtro de busca pelo nome ou descrição
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchLower) || 
        (app.description?.toLowerCase() || "").includes(searchLower)
      );
    }
    
    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter(app => app.type === typeFilter);
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      const valueA = a[sortBy as keyof Application] || "";
      const valueB = b[sortBy as keyof Application] || "";
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === "asc" 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
    setFilteredApps(filtered);
  }, [applications, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

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
      setFilteredApps(data.applications || []);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

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
      'Pendente': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pendente' },
      'Em Análise': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Em Análise' },
      'Aprovado': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Aprovado' },
      'Rejeitado': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejeitado' }
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
    
    return (
      <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium border`}>
        {statusInfo.label}
      </span>
    );
  };

  // Obter ícone para o tipo de aplicação
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'WEB':
        return <Laptop className="h-4 w-4 mr-1" />;
      case 'MOBILE':
        return <Smartphone className="h-4 w-4 mr-1" />;
      case 'DESKTOP':
        return <MonitorIcon className="h-4 w-4 mr-1" />;
      default:
        return <FileQuestion className="h-4 w-4 mr-1" />;
    }
  };

  // Toggle ordenação
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 shadow-sm"
        >
          <PlusCircle size={16} />
          Nova Aplicação
        </Link>
      </div>
      
      {/* Filtros e pesquisa */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-4 pr-4 py-2 flex-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os tipos</option>
              <option value="WEB">Aplicação Web</option>
              <option value="MOBILE">Aplicação Móvel</option>
              <option value="DESKTOP">Aplicação Desktop</option>
              <option value="OUTRO">Outro</option>
            </select>
            
            <button 
              onClick={() => fetchData()}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              title="Atualizar dados"
            >
              <RefreshCcw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-md mb-3"></div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          {applications.length > 0 ? (
            <>
              <h3 className="text-lg font-medium mb-2">Nenhuma aplicação corresponde aos filtros</h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar seus critérios de busca ou limpar os filtros.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTypeFilter("");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition"
              >
                Limpar filtros
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">Nenhuma aplicação encontrada</h3>
              <p className="text-gray-500 mb-6">
                Você ainda não enviou nenhuma aplicação para avaliação de usabilidade.
              </p>
              <Link 
                href="/applications/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2 inline-flex"
              >
                <PlusCircle size={16} />
                Enviar Nova Aplicação
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th 
                    className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th 
                    className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Data de Envio
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/applications/${app.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        {app.name}
                      </Link>
                      {app.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                          {app.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        {getTypeIcon(app.type)}
                        <span>{app.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link 
                          href={`/applications/${app.id}`}
                          className="text-gray-600 hover:text-indigo-600 flex items-center"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span>Ver</span>
                        </Link>
                        <Link 
                          href={`/applications/${app.id}/edit`}
                          className="text-gray-600 hover:text-indigo-600 flex items-center"
                          title="Editar aplicação"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Editar</span>
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