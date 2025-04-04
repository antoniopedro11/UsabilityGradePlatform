import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema para validação da criação de resposta
const createResponseSchema = z.object({
  content: z.string().min(3).max(5000),
  topicId: z.string(),
  userId: z.string()
});

// POST /api/forum/post-response
export async function POST(req: NextRequest) {
  try {
    // Validar os dados da requisição
    const body = await req.json();
    const validationResult = createResponseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { content, topicId, userId } = validationResult.data;
    
    // Verificar se o tópico existe
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
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Criar a resposta
    const response = await prisma.forumResponse.create({
      data: {
        content,
        authorId: userId,
        topicId,
      }
    });
    
    // Atualizar a data de última atualização do tópico
    await prisma.forumTopic.update({
      where: { id: topicId },
      data: { updatedAt: new Date() },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resposta criada com sucesso',
      response: {
        id: response.id,
        content: response.content,
        createdAt: response.createdAt,
        authorName: user.name
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar resposta' },
      { status: 500 }
    );
  }
} 