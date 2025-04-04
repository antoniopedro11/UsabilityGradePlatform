"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { 
  UserPlus, 
  Edit, 
  Trash2,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserX,
  Filter,
  User,
  Users
} from "lucide-react";
import { FaSearch, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentAdmin, setCurrentAdmin] = useState<UserData | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  // Estado para modal de edição
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // No início do componente AdminUsersPage, adicione a variável de estado para mensagens
  const [message, setMessage] = useState<string | null>(null);

  // Verificar se o usuário é administrador e carregar utilizadores
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Verificar se o utilizador atual tem acesso de administrador
  const checkAdminAccess = async () => {
    try {
      console.log("Verificando acesso de administrador...");
      const userData = localStorage.getItem("userData");
      if (!userData) {
        console.error("Dados de utilizador não encontrados");
        router.push("/login?redirect=/admin/users");
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log("Dados do utilizador:", parsedUser);
      
      if (parsedUser.role?.toLowerCase() !== "admin") {
        setError("Acesso negado. Você não tem permissões de administrador.");
        console.error("Papel de utilizador:", parsedUser.role);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        return;
      }

      // Armazenar os dados do utilizador em um cookie para que o middleware possa acessá-los
      document.cookie = `userData=${encodeURIComponent(userData)}; path=/; max-age=86400`;
      console.log("Cookie de administrador definido");

      setCurrentAdmin(parsedUser);
      
      // Após confirmar que o usuário é admin, carregar os usuários
      fetchUsers();
    } catch (error) {
      console.error("Erro ao verificar acesso de administrador:", error);
      router.push("/login?redirect=/admin/users");
    }
  };

  // Carregar lista de utilizadores
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando lista de utilizadores...");
      // Construir os parâmetros da consulta
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Falha ao carregar utilizadores");
      }
      
      const data = await response.json();
      console.log("Utilizadores carregados:", data);
      
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
      setTotalUsers(data.total || 0);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao carregar utilizadores:", err);
      setError("Erro ao carregar lista de utilizadores. Tente novamente mais tarde.");
      setIsLoading(false);
      
      // Se não conseguir carregar do backend, mostrar dados mockados temporariamente
      const mockUsers = [
        { id: "1", name: "Administrador", email: "admin@example.com", role: "admin", createdAt: new Date().toISOString() },
        { id: "2", name: "Usuário Normal", email: "user@example.com", role: "standard", createdAt: new Date().toISOString() },
        { id: "3", name: "Maria Silva", email: "maria@example.com", role: "expert", createdAt: new Date().toISOString() }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setTotalUsers(mockUsers.length);
    }
  };

  // Filtrar utilizadores com base na pesquisa
  useEffect(() => {
    if (search) {
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  // Configuração para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Mudar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Iniciar edição de utilizador
  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  // Atualizar formulário de edição
  const updateEditForm = (field: string, value: string) => {
    setEditForm({
      ...editForm,
      [field]: value
    });
  };

  // Salvar alterações do utilizador
  const saveUserEdit = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar utilizador");
      }
      
      const data = await response.json();
      
      // Mostrar mensagem de sucesso
      setError(null);
      setMessage(data.message || "Utilizador atualizado com sucesso");
      
      // Atualizar a lista de utilizadores após edição bem-sucedida
      fetchUsers();
      
      // Fechar o modal
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar utilizador");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edição
  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  // Confirmar exclusão de utilizador
  const confirmDelete = (userId: string) => {
    setDeleteConfirmUser(userId);
    setShowDeleteModal(true);
  };

  // Cancelar exclusão
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteConfirmUser(null);
  };

  // Excluir utilizador
  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao excluir utilizador");
      }
      
      const data = await response.json();
      
      // Mostrar mensagem de sucesso
      setError(null);
      setMessage(data.message || "Utilizador excluído com sucesso");
      
      // Atualizar a lista de utilizadores após exclusão bem-sucedida
      fetchUsers();
      
      // Fechar o modal
      setShowDeleteModal(false);
      setDeleteConfirmUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao excluir utilizador");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Formatação de data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  // Formatação de função para exibição
  const formatRole = (role: string) => {
    const roles: Record<string, string> = {
      "admin": "Administrador",
      "standard": "Utilizador Normal", 
      "user": "Utilizador Normal",
      "expert": "Especialista",
      "evaluator": "Especialista",
      "business": "Empresarial"
    };
    
    return roles[role.toLowerCase()] || role;
  };

  // Função para fazer logout
  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  // Se estiver carregando, mostrar spinner
  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-t-blue-500 border-blue-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestão de Utilizadores</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar utilizadores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-800 border-gray-700 text-gray-100"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Utilizador
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 rounded-md bg-green-900/30 text-green-400 text-sm">
          {message}
        </div>
      )}
      
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Função</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data de Criação</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-200 mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-medium text-gray-200">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-900 text-purple-200' :
                      user.role === 'expert' ? 'bg-blue-900 text-blue-200' :
                      user.role === 'business' ? 'bg-green-900 text-green-200' :
                      'bg-gray-700 text-gray-200'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => confirmDelete(user.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
              }`}
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredUsers.length)}
                </span>{" "}
                de <span className="font-medium">{filteredUsers.length}</span> utilizadores
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                    currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-indigo-900 border-indigo-800 text-indigo-300'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                    currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  <span className="sr-only">Próximo</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de edição de utilizador */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-200">Editar Utilizador</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <Input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => updateEditForm('name', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => updateEditForm('email', e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Função
                </label>
                <select
                  value={editForm.role}
                  onChange={e => updateEditForm('role', e.target.value)}
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-gray-200"
                >
                  <option value="standard">Utilizador Normal</option>
                  <option value="expert">Especialista</option>
                  <option value="business">Negócio</option>
                  <option value="admin">Administrador</option>
                </select>
                {editForm.role === "admin" && editingUser?.role !== "admin" && (
                  <p className="mt-1 text-sm text-yellow-400">
                    Atenção: Está prestes a promover este utilizador a administrador.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <Button variant="outline" onClick={cancelEdit} className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={saveUserEdit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && deleteConfirmUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-center mb-6 text-red-400">
              <UserX className="h-12 w-12" />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-4 text-gray-200">Confirmar Exclusão</h2>
            <p className="text-gray-300 text-center mb-6">
              Tem certeza que deseja excluir este utilizador? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={cancelDelete} className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">
                Cancelar
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteUser(deleteConfirmUser)}
                disabled={isLoading}
              >
                {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 