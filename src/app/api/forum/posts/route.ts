import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const postSchema = z.object({
  topicId: z.string().cuid(),
  content: z.string().min(1, "O conteúdo da resposta não pode estar vazio"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para responder a um tópico" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const body = postSchema.parse(json);

    // Verificar se o tópico existe e não está bloqueado
    const topic = await prisma.forumTopic.findUnique({
      where: { id: body.topicId },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Tópico não encontrado" },
        { status: 404 }
      );
    }

    // Apenas administradores e moderadores podem responder a tópicos bloqueados
    if (topic.isLocked && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
      return NextResponse.json(
        { error: "Este tópico está bloqueado e não aceita novas respostas" },
        { status: 403 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        content: body.content,
        topicId: body.topicId,
        authorId: session.user.id,
      },
    });

    // Atualizar a data de atualização do tópico
    await prisma.forumTopic.update({
      where: { id: body.topicId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error("[FORUM_POST]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para excluir uma resposta" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da resposta não fornecido" },
        { status: 400 }
      );
    }

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: { topic: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o autor da resposta ou um administrador/moderador
    if (
      post.authorId !== session.user.id &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "MODERATOR"
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta resposta" },
        { status: 403 }
      );
    }

    await prisma.forumPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FORUM_POST_DELETE]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para editar uma resposta" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { id, content } = json;

    if (!id || !content) {
      return NextResponse.json(
        { error: "ID da resposta e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const post = await prisma.forumPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o autor da resposta ou um administrador/moderador
    if (
      post.authorId !== session.user.id &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "MODERATOR"
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta resposta" },
        { status: 403 }
      );
    }

    const updatedPost = await prisma.forumPost.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[FORUM_POST_UPDATE]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 