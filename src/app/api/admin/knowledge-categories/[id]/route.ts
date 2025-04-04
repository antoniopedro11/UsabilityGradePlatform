import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET para buscar uma categoria específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const category = await prisma.knowledgeCategory.findUnique({
      where: { id },
      include: { articles: true }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categoria" },
      { status: 500 }
    );
  }
}

// PUT para atualizar uma categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome da categoria é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o nome já existe em outra categoria
    const existingCategory = await prisma.knowledgeCategory.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Verificar se a categoria existe
    const categoryExists = await prisma.knowledgeCategory.findUnique({
      where: { id }
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Atualiza a categoria
    const updatedCategory = await prisma.knowledgeCategory.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: { articles: true }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// DELETE para remover uma categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    // Verificar se a categoria existe
    const category = await prisma.knowledgeCategory.findUnique({
      where: { id },
      include: { articles: true }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Se houver artigos vinculados, remover a associação
    if (category.articles.length > 0) {
      await prisma.knowledgeArticle.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
      });
    }

    // Remover a categoria
    await prisma.knowledgeCategory.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
} 