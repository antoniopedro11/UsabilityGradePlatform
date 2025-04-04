"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewRegistration = searchParams.get("new") === "true";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("standard");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cleanupComplete, setCleanupComplete] = useState(false);
  
  // Limpeza extremamente agressiva ao carregar a página
  useEffect(() => {
    const cleanupSession = () => {
      try {
        // Armazenar o valor do parâmetro new
        if (isNewRegistration) {
          sessionStorage.setItem("forced_new_registration", "true");
        }
        
        // Limpar completamente o localStorage e sessionStorage
        localStorage.clear();
        
        // Manter apenas nossa flag de registro forçado
        const forcedRegistration = sessionStorage.getItem("forced_new_registration");
        sessionStorage.clear();
        if (forcedRegistration) {
          sessionStorage.setItem("forced_new_registration", forcedRegistration);
        }
        
        console.log("Storage limpo com sucesso");
        
        // Não verificar mais se existem dados de usuário após a limpeza
        return true;
        
      } catch (error) {
        console.error("Erro ao limpar dados:", error);
        return false;
      }
    };
    
    const cleanupResult = cleanupSession();
    setCleanupComplete(cleanupResult);
    
    // Desativar verificações de autenticação enquanto estiver na página de registro
    const beforeUnloadHandler = () => {
      sessionStorage.removeItem("forced_new_registration");
    };
    
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [isNewRegistration]);
  
  // Se a limpeza não foi completa, não renderizar o resto da página ainda
  if (!cleanupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Preparando formulário de registro...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Enviando requisição para /api/register-simple");
      
      const response = await fetch("/api/register-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha no registro");
      }

      // Salvar dados do usuário no localStorage
      if (data.user) {
        console.log("Salvando dados do usuário:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirecionar para a página de login com mensagem de sucesso
      router.push("/login?success=registration");
      
    } catch (error: any) {
      console.error("Erro no registro:", error);
      setError(error.message || "Falha no registro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Logo size="md" showTagline={false} />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeButton />
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 px-6 py-8">
              <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <Logo variant="white" size="lg" showTagline={false} />
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                      Crie sua conta
                    </h1>
                    <p className="text-sm text-green-100">
                      Preencha os dados abaixo para começar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Palavra-passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tipo de Conta
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm"
                    required
                  >
                    <option value="standard">Usuário Padrão</option>
                    <option value="expert">Especialista em Usabilidade</option>
                    <option value="business">Empresarial</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {role === 'standard' && 'Para avaliação pessoal de websites e aplicações.'}
                    {role === 'expert' && 'Para profissionais que oferecem avaliações de usabilidade.'}
                    {role === 'business' && 'Para empresas que desejam avaliar seus produtos.'}
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    Já tem uma conta?
                  </span>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                  >
                    Entrar
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Ao criar uma conta, você concorda com nossos{" "}
              <Link
                href="/terms"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 