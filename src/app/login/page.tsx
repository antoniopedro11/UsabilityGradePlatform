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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successParam = searchParams.get("success");

  // Verificar parâmetros de sucesso
  useEffect(() => {
    // Limpar dados antigos
    localStorage.clear();
    
    if (successParam === "registration") {
      setShowSuccess(true);
      setMessage("Registro concluído com sucesso! Faça login para começar.");
    }
  }, [successParam]);

  // Função direta para ir para o dashboard
  const goToDashboard = (userData: any) => {
    // Salvar usuário no localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Redirecionar usando método HTML direto
    document.location.href = "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Enviando requisição para /api/login-simple");
      
      const response = await fetch("/api/login-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha no login");
      }

      if (data.user) {
        // Preparar os dados do usuário
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        };
        
        setMessage("Login bem-sucedido! Redirecionando...");
        
        // Atraso pequeno para permitir que a mensagem seja mostrada
        setTimeout(() => {
          goToDashboard(userData);
        }, 500);
      } else {
        throw new Error("Dados de usuário incompletos");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError(error.message || "Falha no login. Tente novamente.");
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
            <Link href="/register">
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 px-6 py-8">
              <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <Logo variant="white" size="lg" showTagline={false} />
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                      Bem-vindo novamente
                    </h1>
                    <p className="text-sm text-blue-100">
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
                <div className="mb-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
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
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "A entrar..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    Não tem uma conta?
                  </span>
                  <Link
                    href="/register"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Registrar-se
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Ao acessar a plataforma, você concorda com nossos{" "}
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
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