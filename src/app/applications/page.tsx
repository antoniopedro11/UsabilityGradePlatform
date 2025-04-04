"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  description?: string | null;
  url?: string | null;
  submitter?: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function SimpleApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/applications');
        
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos:", data);
        setApplications(data.applications || []);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'red',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        zIndex: 1000
      }}>
        PÁGINA SIMPLIFICADA DE APLICAÇÕES
      </div>
      
      <h1 style={{ marginTop: '60px' }}>Aplicações</h1>
      
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <div>
          <p style={{ color: 'red' }}>Erro: {error}</p>
          <p>Verifique o console para mais detalhes</p>
        </div>
      ) : applications.length === 0 ? (
        <div>
          <p>Nenhuma aplicação encontrada.</p>
          <div style={{ marginTop: '20px' }}>
            <Link href="/applications/new" style={{ 
              background: 'blue', 
              color: 'white', 
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}>
              Nova Aplicação
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Total de aplicações: {applications.length}</p>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Nome</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Tipo</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{app.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{app.type}</td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{app.status}</td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                    <Link href={`/applications/${app.id}`} style={{
                      background: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      color: '#1f2937'
                    }}>
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/teste-aplicacoes" style={{ marginRight: '10px', color: 'blue' }}>
          Página de Teste
        </Link>
        <Link href="/login" style={{ color: 'blue' }}>
          Voltar para Login
        </Link>
      </div>
    </div>
  );
} 