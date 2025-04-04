import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const skip = (page - 1) * perPage;

    // Construir a consulta where para o Prisma
    const where: Prisma.TemplateWhereInput = {
      creatorId: userData.id
    };
    
    // Adicionar filtro de pesquisa de texto se fornecido
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } as Prisma.StringFilter },
        { description: { contains: query, mode: 'insensitive' } as Prisma.StringFilter }
      ];
    }
    
    // Adicionar filtro de status se fornecido
    if (statusFilter) {
      where.status = statusFilter as Prisma.EnumTemplateStatusFilter;
    }

    const [templates, totalCount] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: perPage,
        include: {
          _count: {
            select: { forms: true }
          }
        }
      }),
      prisma.template.count({ where })
    ]);

    const formattedTemplates = templates.map(template => ({
      ...template,
      formsCount: template._count.forms
    }));

    return NextResponse.json({
      templates: formattedTemplates,
      pagination: {
        total: totalCount,
        page,
        perPage,
        pageCount: Math.ceil(totalCount / perPage)
      }
    });
  } catch (error) {
    console.error("Erro ao listar templates:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
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
    const { title, description, status, forms } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        title,
        description,
        status: status || "DRAFT",
        creatorId: userData.id,
        ...(forms && forms.length > 0
          ? {
              forms: {
                connect: forms.map((formId: string) => ({ id: formId }))
              }
            }
          : {})
      }
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar template:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
} 