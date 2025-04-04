import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET para listar todos os artigos
export async function GET(request: NextRequest) {
  console.log("API: GET /api/admin/knowledge - Recebendo requisição");
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    
    console.log("API: Parâmetros de busca:", { categoryId });
    
    // Condições de busca
    const where = categoryId 
      ? { categoryId: categoryId } 
      : {};
    
    console.log("API: Buscando artigos com where:", where);
    
    // Tente conectar ao banco de dados
    console.log("API: Testando conexão com o banco de dados");
    await prisma.$connect();
    console.log("API: Conexão com o banco de dados estabelecida");
    
    console.log("API: Executando consulta de artigos");
    const articles = await prisma.knowledgeArticle.findMany({
      where,
      include: { category: true },
      orderBy: { updatedAt: "desc" }
    });

    console.log(`API: ${articles.length} artigos encontrados`);
    return NextResponse.json(articles);
  } catch (error) {
    console.error("API: Erro ao buscar artigos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar artigos" },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
      console.log("API: Desconectado do banco de dados");
    } catch (err) {
      console.error("API: Erro ao desconectar do banco de dados:", err);
    }
  }
}

// POST para criar um novo artigo
export async function POST(request: NextRequest) {
  console.log("API: POST /api/admin/knowledge - Recebendo requisição");
  try {
    const body = await request.json();
    const { title, content, categoryId } = body;
    
    console.log("API: Dados recebidos:", { title, content, categoryId });

    if (!title || !content) {
      console.log("API: Validação falhou - título ou conteúdo ausente");
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Cria um novo artigo
    console.log("API: Criando novo artigo");
    const newArticle = await prisma.knowledgeArticle.create({
      data: {
        title,
        content,
        categoryId: categoryId || null,
      },
      include: { category: true }
    });

    console.log("API: Artigo criado com sucesso:", newArticle.id);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("API: Erro ao criar artigo:", error);
    return NextResponse.json(
      { error: "Erro ao criar artigo" },
      { status: 500 }
    );
  }
} 