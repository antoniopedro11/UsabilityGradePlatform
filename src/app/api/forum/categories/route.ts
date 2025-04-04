import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Esquema para validação de criação ou atualização de categoria
const categorySchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
});

// GET /api/forum/categories
export async function GET(request: NextRequest) {
  try {
    // Usar try-catch para capturar erros do Prisma
    try {
      const categories = await db.forumCategory.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              topics: true
            }
          }
        }
      });
      return NextResponse.json(categories);
    } catch (prismaError) {
      console.error("Erro Prisma ao buscar categorias:", prismaError);
      // Tentar buscar categorias sem a contagem de tópicos
      const categoriesSimple = await db.forumCategory.findMany({
        orderBy: { name: "asc" }
      });
      
      // Adicionar a contagem vazia manualmente
      const categoriesWithCount = categoriesSimple.map(cat => ({
        ...cat,
        _count: { topics: 0 }
      }));
      
      return NextResponse.json(categoriesWithCount);
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

// POST /api/forum/categories
export async function POST(request: NextRequest) {
  try {
    console.log("API: Iniciando criação de categoria");
    
    // Permitir temporariamente a criação de categorias sem autenticação
    // para fins de desenvolvimento e teste
    console.log("API: Criação de categoria - Autenticação temporariamente desativada para testes");
    
    // Obter e validar os dados
    const data = await request.json();
    
    // Validar dados
    const validatedData = categorySchema.parse(data);
    
    // Verificar se já existe uma categoria com o mesmo slug
    const existingCategory = await db.forumCategory.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingCategory) {
      console.log(`API: Criação de categoria - Slug duplicado: ${validatedData.slug}`);
      return NextResponse.json(
        { error: "Já existe uma categoria com este slug" },
        { status: 400 }
      );
    }
    
    // Criar categoria
    const newCategory = await db.forumCategory.create({
      data: validatedData,
    });
    
    console.log(`API: Categoria criada com sucesso: ${newCategory.name}`);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("API: Erro de validação ao criar categoria:", error.errors);
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("API: Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}

// PUT /api/forum/categories?id=[id]
export async function PUT(request: NextRequest) {
  try {
    // Permitir temporariamente a edição de categorias sem autenticação
    // para fins de desenvolvimento e teste
    
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID da categoria não fornecido" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Validar dados
    const validatedData = categorySchema.parse(data);
    
    // Verificar se a categoria existe
    const existingCategory = await db.forumCategory.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }
    
    // Verificar se o slug já está em uso por outra categoria
    if (validatedData.slug !== existingCategory.slug) {
      const categoryWithSlug = await db.forumCategory.findUnique({
        where: { slug: validatedData.slug },
      });
      
      if (categoryWithSlug && categoryWithSlug.id !== id) {
        return NextResponse.json(
          { error: "Já existe uma categoria com este slug" },
          { status: 400 }
        );
      }
    }
    
    // Atualizar categoria
    const updatedCategory = await db.forumCategory.update({
      where: { id },
      data: validatedData,
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/categories?id=[id]
export async function DELETE(request: NextRequest) {
  try {
    // Permitir temporariamente a exclusão de categorias sem autenticação
    // para fins de desenvolvimento e teste
    
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID da categoria não fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar se a categoria existe
    const existingCategory = await db.forumCategory.findUnique({
      where: { id },
      include: { topics: { select: { id: true } } },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }
    
    // Excluir categoria (as relações serão excluídas automaticamente devido ao onDelete: Cascade)
    await db.forumCategory.delete({
      where: { id },
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