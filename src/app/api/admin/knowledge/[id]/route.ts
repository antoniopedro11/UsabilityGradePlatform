import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET para buscar um artigo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artigo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Erro ao buscar artigo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar artigo" },
      { status: 500 }
    );
  }
}

// PUT para atualizar um artigo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await request.json();
    const { title, content, categoryId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o artigo existe
    const existingArticle = await prisma.knowledgeArticle.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Artigo não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o artigo
    const updatedArticle = await prisma.knowledgeArticle.update({
      where: { id },
      data: {
        title,
        content,
        categoryId: categoryId || null,
      },
      include: { category: true }
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Erro ao atualizar artigo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar artigo" },
      { status: 500 }
    );
  }
}

// DELETE para remover um artigo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    // Verificar se o artigo existe
    const existingArticle = await prisma.knowledgeArticle.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Artigo não encontrado" },
        { status: 404 }
      );
    }

    // Remove o artigo
    await prisma.knowledgeArticle.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir artigo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir artigo" },
      { status: 500 }
    );
  }
} 