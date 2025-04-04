import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema para validação da criação de resposta
const createResponseSchema = z.object({
  content: z.string().min(3).max(5000),
  topicId: z.string(),
});

// Schema para validação da atualização de resposta
const updateResponseSchema = z.object({
  content: z.string().min(3).max(5000),
});

// Função para verificar se o usuário pode moderar
async function canModerate(session: any) {
  if (!session) return false;
  
  return session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
}

// GET /api/forum/responses
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');
    const id = searchParams.get('id');
    const forParam = searchParams.get('for');
    
    // Casos de uso específicos
    
    // 1. Buscar uma resposta específica por ID
    if (id) {
      const response = await prisma.forumResponse.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          topic: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
      
      if (!response) {
        return NextResponse.json(
          { error: 'Resposta não encontrada' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(response);
    }
    
    // 2. Listar respostas para moderação
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
      
      const responses = await prisma.forumResponse.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 50, // Limitar para os 50 posts mais recentes
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          topic: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
      
      return NextResponse.json(responses);
    }
    
    // 3. Listar respostas por tópico
    if (topicId) {
      const topic = await prisma.forumTopic.findUnique({
        where: { id: topicId },
      });
      
      if (!topic) {
        return NextResponse.json(
          { error: 'Tópico não encontrado' },
          { status: 404 }
        );
      }
      
      const responses = await prisma.forumResponse.findMany({
        where: { topicId },
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
      });
      
      return NextResponse.json(responses);
    }
    
    // 4. Caso padrão (não permitido - deve especificar filtros)
    return NextResponse.json(
      { error: 'Deve especificar um ID de tópico ou outro parâmetro de filtro' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao listar respostas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar respostas' },
      { status: 500 }
    );
  }
}

// POST /api/forum/responses
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação via NextAuth
    const session = await getServerSession(authOptions);
    
    // Verificar também cabeçalho de autenticação personalizado
    const authHeader = req.headers.get('Authorization');
    const userId = req.headers.get('X-User-Id'); // Cabeçalho adicional com o ID do usuário
    
    // Se não há sessão NextAuth nem cabeçalhos de autenticação customizados
    if (!session && !authHeader && !userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Determinar o ID do usuário - ou da sessão NextAuth ou do cabeçalho
    const currentUserId = session?.user?.id || userId;
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado' },
        { status: 401 }
      );
    }
    
    // Validar os dados da requisição
    const body = await req.json();
    const validationResult = createResponseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { content, topicId } = validationResult.data;
    
    // Verificar se o tópico existe e se está aberto para respostas
    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId },
    });
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Tópico não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o tópico está fechado
    if (topic.isClosed) {
      return NextResponse.json(
        { error: 'Este tópico está fechado e não aceita novas respostas' },
        { status: 403 }
      );
    }
    
    // Criar a resposta
    const response = await prisma.forumResponse.create({
      data: {
        content,
        authorId: currentUserId,
        topicId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    // Atualizar a data de última atualização do tópico
    await prisma.forumTopic.update({
      where: { id: topicId },
      data: { updatedAt: new Date() },
    });
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar resposta' },
      { status: 500 }
    );
  }
}

// PATCH /api/forum/responses?id=<id>
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
    
    // Obter o ID da resposta
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da resposta não fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se a resposta existe
    const response = await prisma.forumResponse.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true },
        },
        topic: {
          select: { id: true, isClosed: true },
        },
      },
    });
    
    if (!response) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar permissões (apenas autor ou moderador/admin)
    if (response.author.id !== session.user.id && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }
    
    // Verificar se o tópico está fechado
    if (response.topic.isClosed && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Este tópico está fechado e não permite edição de respostas' },
        { status: 403 }
      );
    }
    
    // Validar os dados da requisição
    const body = await req.json();
    const validationResult = updateResponseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { content } = validationResult.data;
    
    // Atualizar a resposta
    const updatedResponse = await prisma.forumResponse.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.error('Erro ao atualizar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar resposta' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/responses?id=<id>
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
    
    // Obter o ID da resposta
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da resposta não fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se a resposta existe
    const response = await prisma.forumResponse.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true },
        },
        topic: {
          select: { id: true, isClosed: true },
        },
      },
    });
    
    if (!response) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar permissões (apenas autor ou moderador/admin)
    if (response.author.id !== session.user.id && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }
    
    // Verificar se o tópico está fechado
    if (response.topic.isClosed && !(await canModerate(session))) {
      return NextResponse.json(
        { error: 'Este tópico está fechado e não permite exclusão de respostas' },
        { status: 403 }
      );
    }
    
    // Excluir a resposta
    await prisma.forumResponse.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir resposta' },
      { status: 500 }
    );
  }
} 