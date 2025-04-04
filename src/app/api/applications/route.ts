import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// GET: Obter todas as aplicações
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (opcional para visualização pública)
    const session = await auth();
    
    // Se você quiser restringir apenas a usuários autenticados:
    // if (!session) {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    // }
    
    // Paginação (opcional)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Buscar aplicações com contador total para paginação
    const [applications, total] = await Promise.all([
      db.application.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          submitter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.application.count(),
    ]);
    
    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar aplicações:", error);
    return NextResponse.json({ error: "Erro ao buscar aplicações" }, { status: 500 });
  }
}

// POST: Criar uma nova aplicação
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (obrigatório para criar)
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Nome e tipo são campos obrigatórios" },
        { status: 400 }
      );
    }
    
    // Criar aplicação
    const application = await db.application.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        url: body.url,
        status: "Pendente", // Status inicial
        submitterId: session.user.id,
      },
    });
    
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aplicação:", error);
    return NextResponse.json({ error: "Erro ao criar aplicação" }, { status: 500 });
  }
} 