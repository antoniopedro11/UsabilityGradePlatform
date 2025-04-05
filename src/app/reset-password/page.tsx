"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";
import { LanguageToggle } from "@/components/language-toggle";

export default function ResetPasswordPage() {
  // Estados para as diferentes etapas do processo
  enum ResetStep {
    REQUEST = "request",
    VERIFY = "verify",
    RESET = "reset",
    SUCCESS = "success"
  }

  // Estado atual do processo
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.REQUEST);

  // Estado compartilhado entre etapas
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para feedback e carregamento
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Solicitar código de recuperação
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reset-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao solicitar recuperação de senha");
      }

      // Em desenvolvimento, mostrar o código recebido
      if (data.resetCode) {
        setResetCode(data.resetCode);
        setSuccess(`Código enviado com sucesso: ${data.resetCode} (visível apenas em ambiente de desenvolvimento)`);
      } else {
        setSuccess("Enviamos um código de recuperação para o seu email, se ele estiver cadastrado em nosso sistema.");
      }

      // Avançar para a próxima etapa
      setCurrentStep(ResetStep.VERIFY);
    } catch (error: any) {
      console.error("Erro ao solicitar código:", error);
      setError(error.message || "Erro ao solicitar código de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código de recuperação
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reset-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email,
          code: resetCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data.message || "Código de recuperação inválido");
      }

      // Guardar o ID do usuário para a próxima etapa
      setUserId(data.userId);
      setSuccess("Código verificado com sucesso.");

      // Avançar para a próxima etapa
      setCurrentStep(ResetStep.RESET);
    } catch (error: any) {
      console.error("Erro ao verificar código:", error);
      setError(error.message || "Erro ao verificar código");
    } finally {
      setIsLoading(false);
    }
  };

  // Redefinir a senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validar as senhas
    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          userId,
          code: resetCode,
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Falha ao redefinir a senha");
      }

      setSuccess("Senha redefinida com sucesso.");

      // Avançar para a etapa final
      setCurrentStep(ResetStep.SUCCESS);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Erro ao redefinir senha");
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
            <LanguageToggle />
            <ThemeButton />
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
                      Recuperar Palavra-passe
                    </h1>
                    <p className="text-sm text-green-100">
                      {currentStep === ResetStep.REQUEST && "Digite seu e-mail para receber um código de recuperação"}
                      {currentStep === ResetStep.VERIFY && "Digite o código de recuperação recebido"}
                      {currentStep === ResetStep.RESET && "Defina uma nova senha para sua conta"}
                      {currentStep === ResetStep.SUCCESS && "Senha recuperada com sucesso!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">
                  {success}
                </div>
              )}

              {/* Etapa 1: Solicitar código */}
              {currentStep === ResetStep.REQUEST && (
                <form className="space-y-5" onSubmit={handleRequestCode}>
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

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar código de recuperação"}
                  </Button>
                </form>
              )}

              {/* Etapa 2: Verificar código */}
              {currentStep === ResetStep.VERIFY && (
                <form className="space-y-5" onSubmit={handleVerifyCode}>
                  <div className="space-y-2">
                    <Label htmlFor="resetCode" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Código de recuperação
                    </Label>
                    <Input
                      id="resetCode"
                      type="text"
                      placeholder="Digite o código de 6 dígitos"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full border-gray-300 dark:border-gray-600"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Digite o código de 6 dígitos recebido por email
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verificando..." : "Verificar código"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-300"
                      onClick={() => setCurrentStep(ResetStep.REQUEST)}
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              )}

              {/* Etapa 3: Definir nova senha */}
              {currentStep === ResetStep.RESET && (
                <form className="space-y-5" onSubmit={handleResetPassword}>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Nova senha
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirmar nova senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Redefinir senha"}
                  </Button>
                </form>
              )}

              {/* Etapa 4: Sucesso */}
              {currentStep === ResetStep.SUCCESS && (
                <div className="space-y-5">
                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                    <p className="font-semibold">Senha redefinida com sucesso!</p>
                    <p className="mt-1">Você já pode fazer login com sua nova senha.</p>
                  </div>
                  
                  <Link href="/login">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      Ir para o login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 