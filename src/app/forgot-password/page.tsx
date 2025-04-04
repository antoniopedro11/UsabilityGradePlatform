"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulação da chamada à API - em produção, substituir por chamada real
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao processar o pedido.");
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
              <Button variant="outline" size="sm">
                Entrar
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
                      Recuperação de palavra-passe
                    </h1>
                    <p className="text-sm text-blue-100">
                      Introduza o seu e-mail para receber instruções de recuperação
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center">
                  <div className="mb-4 p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <p>Instruções de recuperação enviadas!</p>
                    <p className="text-sm mt-1">Verifique o seu email para seguir as instruções de recuperação da palavra-passe.</p>
                  </div>
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/login">Voltar para o login</Link>
                  </Button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "A processar..." : "Recuperar palavra-passe"}
                  </Button>

                  <div className="mt-4 text-center">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 