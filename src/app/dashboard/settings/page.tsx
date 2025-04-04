"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ThemeButton } from "@/components/theme-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface UserSettings {
  id: string;
  email: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  language: string;
  timezone: string;
  twoFactorAuth: boolean;
  autoSaveInterval: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [settings, setSettings] = useState<UserSettings>({
    id: "",
    email: "",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    language: "pt-BR",
    timezone: "UTC-3",
    twoFactorAuth: false,
    autoSaveInterval: 5
  });

  useEffect(() => {
    const loadSettings = () => {
      setIsLoading(true);
      
      try {
        // Em um ambiente real, isso seria carregado da API
        const userData = localStorage.getItem("userData");
        
        if (!userData) {
          router.push("/login");
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        
        // Simulação de configurações (em um ambiente real, viriam da API)
        setSettings({
          id: parsedUser.id || "user-123",
          email: parsedUser.email || "usuario@exemplo.com",
          emailNotifications: parsedUser.emailNotifications !== undefined ? parsedUser.emailNotifications : true,
          pushNotifications: parsedUser.pushNotifications !== undefined ? parsedUser.pushNotifications : true,
          weeklyDigest: parsedUser.weeklyDigest !== undefined ? parsedUser.weeklyDigest : false,
          language: parsedUser.language || "pt-BR",
          timezone: parsedUser.timezone || "UTC-3",
          twoFactorAuth: parsedUser.twoFactorAuth !== undefined ? parsedUser.twoFactorAuth : false,
          autoSaveInterval: parsedUser.autoSaveInterval || 5
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setMessage({ type: "error", text: "Não foi possível carregar as configurações" });
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [router]);

  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      
      // Simulação de salvamento (em um ambiente real, seria enviado para a API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar localStorage (simulação)
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = {
          ...userData,
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          weeklyDigest: settings.weeklyDigest,
          language: settings.language,
          timezone: settings.timezone,
          twoFactorAuth: settings.twoFactorAuth,
          autoSaveInterval: settings.autoSaveInterval
        };
        
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
      
      setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
      setIsSaving(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setMessage({ type: "error", text: "Não foi possível salvar as configurações" });
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-white mb-4"></div>
          <p className="text-lg font-medium text-gray-800 dark:text-white">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie as configurações da sua conta e preferências
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === "success" 
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Abas de navegação */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "general"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("general")}
        >
          Geral
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notificações
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "security"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Segurança
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "appearance"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("appearance")}
        >
          Aparência
        </button>
      </div>

      {/* Conteúdo das configurações */}
      {activeTab === "general" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Configurações Gerais</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <select
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC-3">Brasília (UTC-3)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">London (UTC+0)</option>
                <option value="UTC+1">Central Europe (UTC+1)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="autoSaveInterval">Intervalo de Salvamento Automático (minutos)</Label>
              <input
                id="autoSaveInterval"
                name="autoSaveInterval"
                type="number"
                min="1"
                max="60"
                value={settings.autoSaveInterval}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Preferências de Notificação</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber notificações por email sobre atualizações e atividades
                </p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSwitchChange(checked, "emailNotifications")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber notificações push no navegador
                </p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSwitchChange(checked, "pushNotifications")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resumo Semanal</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber um resumo semanal das atividades e progresso
                </p>
              </div>
              <Switch 
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) => handleSwitchChange(checked, "weeklyDigest")}
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "security" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Segurança</h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium mb-2">Email</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{settings.email}</p>
              <Button variant="outline" size="sm">Alterar Email</Button>
            </div>
            
            <div>
              <p className="font-medium mb-2">Senha</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">••••••••••</p>
              <Button variant="outline" size="sm">Alterar Senha</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação de Dois Fatores</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSwitchChange(checked, "twoFactorAuth")}
              />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Sessões Ativas</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-2">
                <p className="font-medium">Este dispositivo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Última atividade: agora mesmo
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Encerrar Todas as Sessões
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "appearance" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Aparência</h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium mb-3">Tema</p>
              <div className="flex items-center space-x-4">
                <ThemeButton />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alternar entre os temas claro e escuro
                </p>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-2">Densidade da Interface</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="density" 
                    value="compact"
                    className="rounded-full"
                  />
                  <span>Compacta</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="density" 
                    value="comfortable"
                    defaultChecked
                    className="rounded-full"
                  />
                  <span>Confortável</span>
                </label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="fontSize">Tamanho da Fonte</Label>
              <select
                id="fontSize"
                name="fontSize"
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Pequeno</option>
                <option value="medium" selected>Médio</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        </Card>
      )}

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
          ) : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
} 