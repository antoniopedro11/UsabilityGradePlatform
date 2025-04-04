"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Enviando solicitação de recuperação para:", email);
      
      const response = await fetch("/api/reset-password", {
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

      // Mostrar mensagem de sucesso
      setSuccess(true);
    } catch (error: any) {
      console.error("Erro na recuperação:", error);
      setError(error.message || "Falha ao solicitar recuperação de senha. Tente novamente.");
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
            <Link href="/register?new=true">
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium">
                Registar
              </Button>
            </Link>
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
                      Recuperar Palavra-passe
                    </h1>
                    <p className="text-sm text-green-100">
                      Digite seu e-mail para receber um link de recuperação
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!success ? (
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
                    {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                    <p className="font-semibold">Solicitação enviada!</p>
                    <p className="mt-1">Se o e-mail <span className="font-medium">{email}</span> estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha em alguns minutos.</p>
                  </div>
                  
                  <Button
                    onClick={() => setSuccess(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Tentar outro e-mail
                  </Button>
                </div>
              )}

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                  >
                    Voltar para login
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link
                    href="/register?new=true"
                    className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                  >
                    Criar conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 