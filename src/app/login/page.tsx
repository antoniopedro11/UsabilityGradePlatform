"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";

// Controle de tentativas de redirecionamento
const LOGIN_SESSION_KEY = "usability_login_attempt";

console.log("DEPURAÇÃO: Página de login carregada. Tente fazer login com admin@example.com / admin123");

export default function LoginPage() {
  console.log("LoginPage inicializado"); // Depuração
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successParam = searchParams.get("success");

  // Limpar SEMPRE todos os dados de sessão ao entrar na página de login
  useEffect(() => {
    console.log("Limpando completamente o storage na página de login");
    // Limpar localStorage e sessionStorage para garantir um estado limpo
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpar também o cookie de autenticação
    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Cookie de autenticação removido");
    
    // Verificar os diferentes parâmetros na URL
    if (successParam === "registration") {
      setShowSuccess(true);
      setMessage("Registro concluído com sucesso! Faça login para começar.");
    } else if (searchParams.get("expired") === "true") {
      setShowSuccess(false);
      setMessage("Sua sessão expirou. Por favor, faça login novamente.");
    }
  }, [successParam, searchParams]);

  // Função direta para ir para o dashboard
  const goToDashboard = () => {
    // Verificar se existe um redirecionamento pendente
    const redirectTo = searchParams.get("redirect");
    
    if (redirectTo) {
      console.log("Redirecionando para a rota original:", redirectTo);
      router.push(redirectTo);
    } else {
      console.log("Redirecionando para o dashboard padrão");
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Tentando login com:", { email, passwordProvided: !!password });

    try {
      console.log("Enviando requisição para /api/auth/login");
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("Resposta recebida:", { 
        status: response.status, 
        ok: response.ok, 
        hasUser: !!data.user,
        data: data
      });

      if (!response.ok) {
        const errorMessage = data.error || "Erro ao fazer login";
        console.error("Erro na resposta:", errorMessage, data);
        throw new Error(errorMessage);
      }

      // Salvar dados do usuário no localStorage
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        lastLogin: new Date().toISOString(),
        forceReauth: false,
      };

      console.log("Salvando dados do usuário:", userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Configurar cookie para autenticação (importante para o middleware)
      document.cookie = `userData=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;
      console.log("Cookie de autenticação configurado");
      
      // Definir tempo de expiração da sessão (24 horas)
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      sessionStorage.setItem("sessionExpiry", expiryTime.toString());
  
      console.log("Login bem-sucedido, dados do usuário:", data.user);
      console.log("Redirecionando para /applications");

      // Verificar como os dados do usuário estão sendo armazenados no cookie
      // Adicionar após configurar o cookie
      console.log("Cookie definido com userData:", JSON.stringify(data.user));

      console.log("Redirecionando para o dashboard");
      goToDashboard();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      {/* Mensagem de depuração */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: 'black',
        color: 'white',
        padding: '10px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}>
        DEPURAÇÃO: Página de login carregada. Tente fazer login com admin@example.com / admin123
      </div>
      
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Logo size="md" showTagline={false} />
            </div>
          </Link>
          <div className="flex items-center">
            <ThemeButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-black to-gray-900 dark:from-black dark:to-gray-800 px-6 py-8">
              <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <Logo variant="white" size="lg" showTagline={false} />
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                      Bem-vindo novamente
                    </h1>
                    <p className="text-sm text-gray-200">
                      Insira os seus dados para aceder à sua conta
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {showSuccess && (
                <div className="mb-4 p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">
                  {message}
                </div>
              )}

              {message && !showSuccess && (
                <div className="mb-4 p-3 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm">
                  {message}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Palavra-passe
                    </Label>
                    <Link href="/reset-password" className="text-xs text-orange-600 dark:text-orange-400 hover:underline">
                      Esqueceu a palavra-passe?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "A entrar..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Não tem uma conta?</span>{" "}
                <Link href="/register" className="text-orange-600 dark:text-orange-400 hover:underline">
                  Registar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 