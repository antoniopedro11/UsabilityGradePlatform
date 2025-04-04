"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DiagnoseAuthPage() {
  const router = useRouter();
  const [localStorageData, setLocalStorageData] = useState<string | null>(null);
  const [cookieData, setCookieData] = useState<string | null>(null);
  const [apiAuthStatus, setApiAuthStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Verificar localStorage
        const userDataFromLS = localStorage.getItem("userData");
        setLocalStorageData(userDataFromLS);

        // Verificar cookies
        const cookies = document.cookie.split(';')
          .map(cookie => cookie.trim())
          .find(cookie => cookie.startsWith('userData='));
        
        if (cookies) {
          const cookieValue = cookies.split('=')[1];
          setCookieData(cookieValue);
        }

        // Verificar API
        const response = await fetch("/api/check-auth", {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        });
        const data = await response.json();
        setApiAuthStatus(data);
      } catch (err) {
        setError("Erro ao verificar autenticação: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const handleFix = () => {
    try {
      // Recuperar dados do usuário do localStorage (se existirem)
      const userData = localStorage.getItem("userData");
      if (userData) {
        // Reconfigurar o cookie
        document.cookie = `userData=${userData}; path=/; max-age=86400; SameSite=Lax`;
        alert("Cookie recriado com sucesso!");
        window.location.reload();
      } else {
        alert("Não há dados de usuário no localStorage para recuperar.");
      }
    } catch (err) {
      alert("Erro ao tentar corrigir: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Diagnóstico de Autenticação</h1>
        
        {isLoading ? (
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Carregando informações...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-6">
              <div className="border dark:border-gray-700 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Status da API</h2>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-auto max-h-40">
                  {JSON.stringify(apiAuthStatus, null, 2)}
                </pre>
              </div>
              
              <div className="border dark:border-gray-700 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">LocalStorage</h2>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-auto max-h-40">
                  {localStorageData ? JSON.stringify(JSON.parse(localStorageData), null, 2) : "Nenhum dado encontrado"}
                </pre>
              </div>
              
              <div className="border dark:border-gray-700 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Cookie</h2>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-auto max-h-40">
                  {cookieData ? JSON.stringify(JSON.parse(decodeURIComponent(cookieData)), null, 2) : "Nenhum cookie encontrado"}
                </pre>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleFix}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Corrigir Cookie
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Desconectar
              </button>
              
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Ir para Dashboard
                </button>
              </Link>
              
              <Link href="/login">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Ir para Login
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 