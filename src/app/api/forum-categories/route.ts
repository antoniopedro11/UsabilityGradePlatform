import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Simulamos algumas categorias para teste
    const dummyCategories = [
      {
        id: "1",
        name: "Discussões Gerais",
        slug: "discussoes-gerais",
        description: "Espaço para debates sobre tópicos gerais relacionados à usabilidade e experiência do usuário.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { topics: 5 }
      },
      {
        id: "2",
        name: "Avaliação Heurística",
        slug: "avaliacao-heuristica",
        description: "Discussões sobre métodos e práticas de avaliação heurística em interfaces.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { topics: 3 }
      },
      {
        id: "3",
        name: "Testes com Usuários",
        slug: "testes-com-usuarios",
        description: "Compartilhe experiências e dúvidas sobre a realização de testes de usabilidade com usuários reais.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { topics: 7 }
      },
      {
        id: "4",
        name: "Acessibilidade",
        slug: "acessibilidade",
        description: "Fórum dedicado à discussão de padrões e práticas de acessibilidade em interfaces digitais.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { topics: 2 }
      }
    ];

    // Tentar obter os dados reais do banco, se falhar, usamos os dados de teste
    try {
      const realCategories = await db.forumCategory.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              topics: true
            }
          }
        }
      });
      
      // Se houver categorias reais, retornamos elas
      if (realCategories.length > 0) {
        return NextResponse.json(realCategories);
      }
    } catch (dbError) {
      // Log do erro mas continuamos com categorias de exemplo
      console.error("Erro ao buscar categorias do banco:", dbError);
    }
    
    // Retornar categorias de exemplo
    return NextResponse.json(dummyCategories);
  } catch (error) {
    console.error("Erro no endpoint de categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias do fórum" },
      { status: 500 }
    );
  }
} 