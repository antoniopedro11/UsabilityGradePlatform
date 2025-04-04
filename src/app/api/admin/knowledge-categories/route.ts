import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET para listar todas as categorias
export async function GET() {
  console.log("API: GET /api/admin/knowledge-categories - Recebendo requisição");
  try {
    console.log("API: Buscando todas as categorias");
    const categories = await prisma.knowledgeCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: "asc" }
    });

    console.log(`API: ${categories.length} categorias encontradas`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("API: Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

// POST para criar uma nova categoria
export async function POST(request: NextRequest) {
  console.log("API: POST /api/admin/knowledge-categories - Recebendo requisição");
  try {
    const body = await request.json();
    const { name, description } = body;
    
    console.log("API: Dados recebidos:", { name, description });

    if (!name) {
      console.log("API: Validação falhou - nome ausente");
      return NextResponse.json(
        { error: "Nome da categoria é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma categoria com este nome
    console.log("API: Verificando se categoria já existe:", name);
    const existingCategory = await prisma.knowledgeCategory.findFirst({
      where: { name }
    });

    if (existingCategory) {
      console.log("API: Categoria já existe");
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Criar nova categoria
    console.log("API: Criando nova categoria");
    const newCategory = await prisma.knowledgeCategory.create({
      data: {
        name,
        description
      }
    });

    console.log("API: Categoria criada com sucesso:", newCategory.id);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("API: Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
} 