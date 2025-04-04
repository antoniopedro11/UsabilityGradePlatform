import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// Função auxiliar para verificar autenticação via cookie
async function getUserFromCookie() {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get("userData");
  
  if (!userDataCookie || !userDataCookie.value) {
    return null;
  }
  
  try {
    return JSON.parse(decodeURIComponent(userDataCookie.value));
  } catch (error) {
    console.error("Erro ao parsear cookie:", error);
    return null;
  }
}

// GET: Obter todas as aplicações
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação via cookie
    const userData = await getUserFromCookie();
    
    // Opcional: Descomentar para restringir acesso apenas a usuários logados
    // if (!userData) {
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
    // Verificar autenticação via cookie
    const userData = await getUserFromCookie();
    if (!userData?.id) {
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
        submitterId: userData.id,
      },
    });
    
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aplicação:", error);
    return NextResponse.json({ error: "Erro ao criar aplicação" }, { status: 500 });
  }
} 