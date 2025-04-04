"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateResponseForm } from "@/components/forum/create-response-form";

interface ClientAuthCheckProps {
  topicId: string;
  isTopicOpen: boolean;
}

export default function ClientAuthCheck({ topicId, isTopicOpen }: ClientAuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar autenticação no localStorage
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          JSON.parse(userData); // Verificar se é um JSON válido
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Dados de usuário inválidos no localStorage:", error);
          localStorage.removeItem("userData"); // Limpar dados inválidos
        }
      }
      setIsLoading(false);
    }
  }, []);
  
  // Durante o carregamento, mostrar indicador
  if (isLoading) {
    return (
      <div className="text-center p-8 animate-pulse">
        <p>Verificando autenticação...</p>
      </div>
    );
  }
  
  // Se o usuário está autenticado e o tópico está aberto
  if (isAuthenticated && isTopicOpen) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Sua Resposta</h2>
        <CreateResponseForm topicId={topicId} />
      </div>
    );
  }
  
  // Se o usuário não está autenticado
  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium">Faça login para responder</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Você precisa estar logado para participar da discussão
        </p>
        <Button asChild>
          <Link href="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }
  
  // Se o tópico está fechado
  return (
    <div className="text-center p-8 border rounded-lg">
      <h3 className="text-lg font-medium">Tópico fechado</h3>
      <p className="text-muted-foreground mt-2">
        Este tópico está fechado para novas respostas
      </p>
    </div>
  );
} 