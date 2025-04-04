"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DiagnosticPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [storageData, setStorageData] = useState<any>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");

  // Lista de credenciais válidas para facilitar o teste
  const validCredentials = [
    { email: "admin@example.com", password: "admin123", role: "admin" },
    { email: "user@example.com", password: "user123", role: "standard" },
    { email: "maria@example.com", password: "maria123", role: "expert" },
    { email: "joao@example.com", password: "joao123", role: "business" }
  ];
  
  // Função para selecionar credenciais pré-definidas
  const selectCredentials = (cred: {email: string, password: string}) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  // Função para verificar localStorage e sessionStorage
  const checkStorage = () => {
    try {
      const userData = localStorage.getItem("userData");
      const sessionExpiry = sessionStorage.getItem("sessionExpiry");
      
      setStorageData({
        userData: userData ? JSON.parse(userData) : null,
        sessionExpiry: sessionExpiry ? new Date(parseInt(sessionExpiry)).toLocaleString() : null,
        now: new Date().toLocaleString()
      });
    } catch (error) {
      setStorageData({ error: "Erro ao ler storage: " + (error instanceof Error ? error.message : String(error)) });
    }
  };

  // Função para testar diretamente a API de login
  const testAuthLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setResult({
        endpoint: "/api/auth/login",
        status: response.status,
        ok: response.ok,
        data
      });
      
      if (response.ok && data.user) {
        // Salvar dados no localStorage para testar
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          lastLogin: new Date().toISOString(),
          forceReauth: false,
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Definir tempo de expiração da sessão
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem("sessionExpiry", expiryTime.toString());
        
        // Atualizar visualização do storage
        checkStorage();
      }
    } catch (err) {
      setError("Erro na requisição: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Função para testar diretamente a API de login legada
  const testLegacyLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/login-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setResult({
        endpoint: "/api/login-simple",
        status: response.status,
        ok: response.ok,
        data
      });
      
      if (response.ok && data.user) {
        // Salvar dados no localStorage para testar
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          lastLogin: new Date().toISOString(),
          forceReauth: false,
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Definir tempo de expiração da sessão
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem("sessionExpiry", expiryTime.toString());
        
        // Atualizar visualização do storage
        checkStorage();
      }
    } catch (err) {
      setError("Erro na requisição: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Função para limpar o storage
  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    checkStorage();
  };

  // Adicionar função para verificar usuários da base de dados Neon
  const checkNeonUsers = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/diagnostic/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await response.json();
      setResult({
        source: "Neon Database",
        users: data.users
      });
    } catch (err) {
      setError("Erro ao verificar usuários na base de dados: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Adicionar função para registrar um novo usuário
  const registerNewUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError("Email e senha são obrigatórios para registrar novo usuário");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName || undefined,
          email: newUserEmail,
          password: newUserPassword
        }),
      });
      
      const data = await response.json();
      setResult({
        action: "Registro de Usuário",
        status: response.status,
        ok: response.ok,
        data
      });
      
      if (response.ok) {
        // Limpar campos após sucesso
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
      }
    } catch (err) {
      setError("Erro ao registrar usuário: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Página de Diagnóstico</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Teste de API de Login</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border rounded p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        
        <div className="mb-6 mt-2">
          <p className="text-sm font-medium mb-2">Credenciais válidas para teste:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {validCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => selectCredentials(cred)}
                className="text-xs bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded flex justify-between items-center"
              >
                <span>{cred.email}</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-1 rounded">{cred.role}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={testAuthLogin} 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Testando..." : "Testar /api/auth/login"}
          </button>
          
          <button 
            onClick={testLegacyLogin} 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Testando..." : "Testar /api/login-simple"}
          </button>
          
          <button 
            onClick={checkStorage} 
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Verificar Storage
          </button>
          
          <button 
            onClick={clearStorage} 
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Limpar Storage
          </button>
          
          <button 
            onClick={checkNeonUsers} 
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Verificar Usuários Neon
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Resultado:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {storageData && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dados de Storage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64">
            {JSON.stringify(storageData, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Registrar Novo Usuário (Teste)</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome (opcional)</label>
            <input 
              type="text" 
              value={newUserName} 
              onChange={(e) => setNewUserName(e.target.value)} 
              className="w-full border rounded p-2"
              placeholder="Nome do usuário"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={newUserEmail} 
              onChange={(e) => setNewUserEmail(e.target.value)} 
              className="w-full border rounded p-2"
              placeholder="exemplo@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              value={newUserPassword} 
              onChange={(e) => setNewUserPassword(e.target.value)} 
              className="w-full border rounded p-2"
              placeholder="Senha forte"
              required
            />
          </div>
        </div>
        
        <button 
          onClick={registerNewUser} 
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Registrando..." : "Registrar Novo Usuário"}
        </button>
      </div>
      
      <div className="flex space-x-4">
        <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Ir para Login
        </Link>
        <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Ir para Dashboard
        </Link>
      </div>
    </div>
  );
} 