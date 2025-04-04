"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { ArrowLeft, User, Lock, Mail, Building, Briefcase, Globe, FileText } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    organization: "",
    jobTitle: "",
    website: "",
  });

  // Buscar o usuário ao carregar a página
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Tentamos buscar os dados do usuário do localStorage
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || "",
            organization: userData.organization || "",
            jobTitle: userData.jobTitle || "",
            website: userData.website || "",
          });
        } else {
          // Se não estiver no localStorage, buscar da API
          const response = await fetch('/api/auth/me');
          
          if (!response.ok) {
            throw new Error('Não autenticado');
          }
          
          const userData = await response.json();
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || "",
            organization: userData.organization || "",
            jobTitle: userData.jobTitle || "",
            website: userData.website || "",
          });
          
          // Armazenar no localStorage para uso futuro
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Aqui seria implementada a atualização do perfil via API
      // Por enquanto só vamos simular uma atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar os dados do usuário localmente
      const updatedUser = {
        ...user,
        name: formData.name,
        bio: formData.bio,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        website: formData.website
      };
      
      setUser(updatedUser);
      
      // Atualizar no localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar o perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Redirecionando para login...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            <Logo size="sm" showTagline={false} />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeButton />
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Perfil do Usuário</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className="grid gap-6">
          {/* Card do perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-orange-600 dark:text-orange-400 text-3xl font-bold border-4 border-white dark:border-gray-700">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <p className="text-orange-100">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {message && (
                <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Informações principais */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing || isLoading}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email não pode ser alterado
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Informações profissionais */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Organização
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Sua empresa ou organização"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Cargo
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      disabled={!isEditing || isLoading}
                      placeholder="Seu cargo ou função"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    placeholder="https://seu-site.com"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Biografia
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    placeholder="Conte um pouco sobre você..."
                    className="min-h-[120px] w-full"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Card de segurança */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança da Conta
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Gerenciamento de acesso e segurança</p>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Alterar Palavra-passe
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  Verificar E-mail
                </Button>

                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                  Excluir Conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 