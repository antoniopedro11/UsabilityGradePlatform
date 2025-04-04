import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Obter os cookies para autenticação
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    if (!userData.id) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const statusFilter = searchParams.get("status") || undefined;
    const typeFilter = searchParams.get("type") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const skip = (page - 1) * perPage;

    // Construir a consulta where para o Prisma
    let where: any = {};
    
    // Por padrão, usuários normais veem apenas suas próprias aplicações
    // Administradores podem ver todas as aplicações
    if (userData.role !== "ADMIN") {
      where.submitterId = userData.id;
    }
    
    // Adicionar filtro de pesquisa de texto se fornecido
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ];
    }
    
    // Adicionar filtro de status se fornecido
    if (statusFilter) {
      where.status = statusFilter;
    }
    
    // Adicionar filtro de tipo se fornecido
    if (typeFilter) {
      where.type = typeFilter;
    }

    // Contar o total de aplicações com base nos filtros para paginação
    const totalCount = await prisma.application.count({ where });
    
    // Obter as aplicações filtradas e paginadas
    const applications = await prisma.application.findMany({
      where,
      skip,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Retornar os dados paginados
    const paginationData = {
      currentPage: page,
      perPage,
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
    };
    
    console.log("Enviando dados de paginação:", paginationData);
    
    return NextResponse.json({
      applications,
      pagination: paginationData,
    });
  } catch (error) {
    console.error("Erro ao buscar aplicações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aplicações" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obter os cookies para autenticação
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("userData");
    
    if (!userDataCookie || !userDataCookie.value) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userData = JSON.parse(decodeURIComponent(userDataCookie.value));
    if (!userData.id) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.name) {
      return NextResponse.json(
        { error: "Nome da aplicação é obrigatório" },
        { status: 400 }
      );
    }

    // Criar uma nova aplicação
    const newApplication = await prisma.application.create({
      data: {
        name: body.name,
        description: body.description || null,
        url: body.url || null,
        type: body.type || "WEB",
        status: "PENDING", // Status inicial sempre é pendente
        screenshots: body.screenshots || null,
        submitterId: userData.id,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aplicação:", error);
    return NextResponse.json(
      { error: "Erro ao criar aplicação" },
      { status: 500 }
    );
  }
} 