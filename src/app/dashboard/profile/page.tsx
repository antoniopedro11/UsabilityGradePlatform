"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  notificationsEnabled?: boolean;
  darkModePreference?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    jobTitle: "",
    company: "",
    bio: "",
    notificationsEnabled: true,
    darkModePreference: "system"
  });

  // Carregar dados do perfil
  useEffect(() => {
    const loadProfile = () => {
      setIsLoading(true);
      
      try {
        // Obter dados do usuário do localStorage (substituir por chamada API em ambiente real)
        const userData = localStorage.getItem("userData");
        
        if (!userData) {
          router.push("/login");
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        
        // Unir os dados do usuário com dados fictícios para o perfil
        setProfile({
          id: parsedUser.id || "user-123",
          name: parsedUser.name || "Usuário",
          email: parsedUser.email || "usuario@exemplo.com",
          role: parsedUser.role || "user",
          jobTitle: parsedUser.jobTitle || "UX Designer",
          company: parsedUser.company || "Empresa",
          bio: parsedUser.bio || "Especialista em experiência do usuário trabalhando com avaliações de usabilidade.",
          notificationsEnabled: parsedUser.notificationsEnabled !== undefined ? parsedUser.notificationsEnabled : true,
          darkModePreference: parsedUser.darkModePreference || "system"
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setErrorMessage("Não foi possível carregar os dados do perfil");
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [router]);

  // Manipular alterações nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Manipular alterações em switches
  const handleSwitchChange = (checked: boolean, name: string) => {
    setProfile(prev => ({ ...prev, [name]: checked }));
  };

  // Salvar o perfil
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      // Simulação de salvamento (substituir por chamada API em ambiente real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar localStorage com os novos dados
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = {
          ...userData,
          name: profile.name,
          email: profile.email,
          jobTitle: profile.jobTitle,
          company: profile.company,
          bio: profile.bio,
          notificationsEnabled: profile.notificationsEnabled,
          darkModePreference: profile.darkModePreference
        };
        
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
      
      setSuccessMessage("Perfil atualizado com sucesso!");
      setIsSaving(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setErrorMessage("Não foi possível salvar as alterações");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-white mb-4"></div>
          <p className="text-lg font-medium text-gray-800 dark:text-white">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visualize e edite suas informações pessoais
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações pessoais */}
        <Card className="p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="jobTitle">Cargo</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={profile.company}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Biografia</Label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Configurações da conta */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações da Conta</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Tipo de Conta</p>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
                {profile.role === "admin" ? "Administrador" : "Usuário"}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber alertas e atualizações</p>
              </div>
              <Switch 
                checked={profile.notificationsEnabled || false}
                onCheckedChange={(checked) => handleSwitchChange(checked, "notificationsEnabled")}
              />
            </div>
            
            <div>
              <p className="font-medium mb-2">Preferência de tema</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="darkModePreference" 
                    value="light"
                    checked={profile.darkModePreference === "light"}
                    onChange={handleChange}
                    className="rounded-full"
                  />
                  <span>Claro</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="darkModePreference" 
                    value="dark"
                    checked={profile.darkModePreference === "dark"}
                    onChange={handleChange}
                    className="rounded-full"
                  />
                  <span>Escuro</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="darkModePreference" 
                    value="system"
                    checked={profile.darkModePreference === "system"}
                    onChange={handleChange}
                    className="rounded-full"
                  />
                  <span>Sistema</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="outline" className="mr-4" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Salvando...
            </>
          ) : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
} 