import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema para validação da criação de tópico
const createTopicSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(5000),
  categoryId: z.string().uuid(),
});

// Schema para validação da atualização de tópico
const updateTopicSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(10).max(5000).optional(),
  categoryId: z.string().uuid().optional(),
});

// Schema para validação da atualização de status (para moderação)
const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "CLOSED", "PINNED"]),
});

// Gerar slug a partir de título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

// Função para verificar se o usuário pode moderar
async function canModerate(session: any) {
  if (!session) return false;
  
  return session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
}

// GET /api/forum/topics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const forParam = searchParams.get('for');
    
    // Casos de uso específicos
    
    // 1. Buscar um tópico específico por ID
    if (id) {
      const topic = await prisma.forumTopic.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          responses: {
            orderBy: { createdAt: 'asc' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      
      if (!topic) {
        return NextResponse.json(
          { error: 'Tópico não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(topic);
    }
    
    // 2. Buscar um tópico por slug e categoria
    if (categoryId && slug) {
      const topic = await prisma.forumTopic.findFirst({
        where: {
          categoryId,
          slug,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          responses: {
            orderBy: { createdAt: 'asc' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      
      if (!topic) {
        return NextResponse.json(
          { error: 'Tópico não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(topic);
    }
    
    // 3. Listar tópicos para moderação
    if (forParam === 'moderation') {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        );
      }
      
      const canUserModerate = await canModerate(session);
      if (!canUserModerate) {
        return NextResponse.json(
          { error: 'Permissão negada' },
          { status: 403 }
        );
      }
      
      const topics = await prisma.forumTopic.findMany({
        orderBy: [
          { status: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });
      
      return NextResponse.json(topics);
    }
    
    // 4. Listar tópicos por categoria
    if (categoryId) {
      const category = await prisma.forumCategory.findUnique({
        where: { id: categoryId },
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        );
      }
      
      const topics = await prisma.forumTopic.findMany({
        where: { categoryId },
        orderBy: [
          { status: 'desc' },
          { updatedAt: 'desc' }
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });
      
      return NextResponse.json(topics);
    }
    
    // 5. Listar todos os tópicos (caso padrão)
    const topics = await prisma.forumTopic.findMany({
      orderBy: [
        { status: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });
    
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Erro ao listar tópicos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar tópicos' },
      { status: 500 }
    );
  }
}

// POST /api/forum/topics
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Validar os dados da requisição
    const body = await req.json();
    const validationResult = createTopicSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { title, content, categoryId } = validationResult.data;
    
    // Verificar se a categoria existe
    const category = await prisma.forumCategory.findUnique({
      where: { id: categoryId },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }
    
    // Gerar slug para o tópico
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar se o slug já existe e adicionar sufixo se necessário
    let existingTopic = await prisma.forumTopic.findFirst({
      where: { 
        categoryId,
        slug 
      },
    });
    
    while (existingTopic) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      existingTopic = await prisma.forumTopic.findFirst({
        where: { 
          categoryId,
          slug 
        },
      });
    }
    
    // Criar o tópico
    const topic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        slug,
        status: "OPEN",
        authorId: session.user.id,
        categoryId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
    });
    
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tópico' },
      { status: 500 }
    );
  }
}

// PATCH /api/forum/topics?id=<id>
export async function PATCH(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter o ID do tópico
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do tópico não fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se o tópico existe
    const topic = await prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Tópico não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar permissões
    const body = await req.json();
    
    // Caso 1: Atualização de status (moderação)
    if ('status' in body) {
      const canUserModerate = await canModerate(session);
      if (!canUserModerate) {
        return NextResponse.json(
          { error: 'Permissão negada' },
          { status: 403 }
        );
      }
      
      const validationResult = updateStatusSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Status inválido' },
          { status: 400 }
        );
      }
      
      const { status } = validationResult.data;
      
      const updatedTopic = await prisma.forumTopic.update({
        where: { id },
        data: { status },
      });
      
      return NextResponse.json(updatedTopic);
    }
    
    // Caso 2: Atualização de conteúdo (autor)
    // Verificar se o usuário é o autor ou pode moderar
    if (topic.author.id !== session.user.id && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }
    
    const validationResult = updateTopicSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    
    if (validationResult.data.title) {
      updateData.title = validationResult.data.title;
      
      // Atualizar slug apenas se o título mudar significativamente
      if (topic.title !== validationResult.data.title) {
        let baseSlug = generateSlug(validationResult.data.title);
        let slug = baseSlug;
        let counter = 1;
        
        let existingTopic = await prisma.forumTopic.findFirst({
          where: { 
            categoryId: topic.categoryId,
            slug,
            id: { not: id },
          },
        });
        
        while (existingTopic) {
          slug = `${baseSlug}-${counter}`;
          counter++;
          existingTopic = await prisma.forumTopic.findFirst({
            where: { 
              categoryId: topic.categoryId,
              slug,
              id: { not: id },
            },
          });
        }
        
        updateData.slug = slug;
      }
    }
    
    if (validationResult.data.content) {
      updateData.content = validationResult.data.content;
    }
    
    if (validationResult.data.categoryId) {
      // Verificar se a categoria existe
      const category = await prisma.forumCategory.findUnique({
        where: { id: validationResult.data.categoryId },
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        );
      }
      
      updateData.categoryId = validationResult.data.categoryId;
    }
    
    const updatedTopic = await prisma.forumTopic.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
    });
    
    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error('Erro ao atualizar tópico:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tópico' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/topics?id=<id>
export async function DELETE(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter o ID do tópico
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do tópico não fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se o tópico existe
    const topic = await prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Tópico não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar permissões (apenas autor ou moderador/admin)
    if (topic.author.id !== session.user.id && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }
    
    // Excluir todas as respostas do tópico primeiro
    await prisma.forumResponse.deleteMany({
      where: { topicId: id },
    });
    
    // Excluir o tópico
    await prisma.forumTopic.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir tópico:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir tópico' },
      { status: 500 }
    );
  }
} 