"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TesteAplicacoesPage() {
  const [contador, setContador] = useState(0);

  return (
    <div className="container mx-auto py-8">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: 'green',
        color: 'white',
        padding: '10px',
        zIndex: 9999
      }}>
        TESTE: Página de Aplicações Simplificada
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teste de Aplicações</h1>
        <p className="text-gray-500 mt-1">
          Esta é uma versão simplificada da página de aplicações para testes
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Componente React Interativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contador: {contador}</p>
          <Button onClick={() => setContador(contador + 1)} className="mt-4">
            Incrementar
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="text-xl font-medium mb-2">Teste de Interface</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Se você está vendo este conteúdo e o botão acima funciona, o React e os componentes estão carregando corretamente.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/teste">
                  Ir para Página de Teste
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/applications">
                  Ir para Aplicações
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 