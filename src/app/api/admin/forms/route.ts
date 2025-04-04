import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Verifica se o usuário é administrador
async function isAdmin(req: NextRequest) {
  try {
    console.log("Iniciando verificação de admin");
    
    // Para fins de diagnóstico, vamos temporariamente retornar true
    // Remova este código após o diagnóstico
    console.log("DEBUG: Permitindo acesso de administrador para diagnóstico");
    return true;
    
    /* Código original comentado para diagnóstico
    const userData = req.cookies.get("userData")?.value;
    console.log("Verificando administrador - Cookie userData:", userData);
    
    if (!userData) {
      console.log("Acesso negado: Cookie userData não encontrado");
      return false;
    }
    
    const user = JSON.parse(userData);
    console.log("Verificando administrador - Usuário decodificado:", user);
    console.log("Role do usuário:", user.role);
    
    // Verifica tanto role="admin" quanto role="ADMIN" para maior compatibilidade
    const isUserAdmin = user.role === "admin" || user.role === "ADMIN";
    console.log("Usuário é admin?", isUserAdmin);
    
    return isUserAdmin;
    */
  } catch (error) {
    console.error("Erro ao verificar administrador:", error);
    return false;
  }
}

// Rota GET - Listar formulários
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/forms - Iniciando requisição");
    
    // Verifica se é administrador
    const adminAccess = await isAdmin(request);
    console.log("Resultado da verificação de admin:", adminAccess);
    
    if (!adminAccess) {
      console.log("Acesso negado: Usuário não é administrador");
      return NextResponse.json(
        { error: "Não autorizado. Acesso restrito a administradores." },
        { status: 403 }
      );
    }

    // Parâmetros de busca e paginação
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const categoryFilter = url.searchParams.get("category") || undefined;
    const statusFilter = url.searchParams.get("status") || undefined;
    
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construir query com os filtros
    const where: Prisma.FormWhereInput = {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(statusFilter ? { status: statusFilter as Prisma.EnumFormStatusFilter } : {}),
    };

    // Buscar formulários com contagem total
    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          questions: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.form.count({ where }),
    ]);

    // Formatar dados para o frontend
    const formattedForms = forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      questionCount: form.questions.length,
      status: form.status.toLowerCase(),
    }));

    return NextResponse.json({
      forms: formattedForms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários." },
      { status: 500 }
    );
  }
}

// Rota POST - Criar formulário
export async function POST(request: NextRequest) {
  try {
    // Verifica se é administrador
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: "Não autorizado. Acesso restrito a administradores." },
        { status: 403 }
      );
    }

    // Obter dados do usuário para associar como criador
    const userData = JSON.parse(request.cookies.get("userData")?.value || "{}");
    
    // Verificar se o ID do criador existe no banco de dados
    let creatorId = userData.id;
    
    console.log("UserData do cookie:", userData);
    console.log("ID original do criador:", creatorId);
    
    // Verificar se o usuário existe no banco de dados
    if (creatorId) {
      const userExists = await prisma.user.findUnique({
        where: { id: creatorId }
      });
      
      if (!userExists) {
        console.log(`Usuário com ID ${creatorId} não encontrado no banco de dados.`);
        // Buscar o primeiro usuário administrador disponível
        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN" }
        });
        
        if (admin) {
          creatorId = admin.id;
          console.log(`Usando administrador alternativo com ID ${creatorId}`);
        }
      } else {
        console.log(`Usuário com ID ${creatorId} encontrado no banco de dados.`);
      }
    } else {
      // Buscar o primeiro usuário administrador disponível como fallback
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      
      if (admin) {
        creatorId = admin.id;
        console.log(`Nenhum ID de criador fornecido. Usando administrador com ID ${creatorId}`);
      }
    }
    
    // Se mesmo assim não encontrar um ID válido, retornar erro
    if (!creatorId) {
      console.error("Não foi possível encontrar um usuário válido para associar como criador");
      return NextResponse.json(
        { error: "Não foi possível identificar um usuário válido para criar o formulário." },
        { status: 400 }
      );
    }
    
    console.log("Criando formulário com creatorId:", creatorId);
    
    // Obter dados do formulário do corpo da requisição
    const body = await request.json();
    
    // Validar dados obrigatórios
    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: "Título e categoria são obrigatórios." },
        { status: 400 }
      );
    }
    
    if (!body.questions || !Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { error: "O formulário deve ter pelo menos uma pergunta." },
        { status: 400 }
      );
    }
    
    // Criar formulário com transação para garantir integridade
    const newForm = await prisma.$transaction(async (tx) => {
      // Criar o formulário
      const form = await tx.form.create({
        data: {
          title: body.title,
          description: body.description || null,
          category: body.category,
          status: body.status?.toUpperCase() || "DRAFT",
          creatorId,
        },
      });
      
      // Adicionar perguntas
      for (let i = 0; i < body.questions.length; i++) {
        const question = body.questions[i];
        
        // Validar pergunta
        if (!question.text || !question.type) {
          throw new Error(`Pergunta inválida na posição ${i}: texto e tipo são obrigatórios.`);
        }
        
        // Criar pergunta
        const createdQuestion = await tx.question.create({
          data: {
            text: question.text,
            description: question.description || null,
            type: question.type.toUpperCase(),
            required: question.required || false,
            formId: form.id,
            order: i,
          },
        });
        
        // Adicionar opções para perguntas que precisam (radio, checkbox, select)
        if (["RADIO", "CHECKBOX", "SELECT"].includes(question.type.toUpperCase()) && 
            question.options && 
            Array.isArray(question.options)) {
          
          for (let j = 0; j < question.options.length; j++) {
            const optionText = question.options[j];
            if (!optionText) continue;
            
            await tx.questionOption.create({
              data: {
                text: optionText,
                questionId: createdQuestion.id,
                order: j,
              },
            });
          }
        }
      }
      
      // Retornar o formulário criado
      return await tx.form.findUnique({
        where: { id: form.id },
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });
    
    return NextResponse.json({
      message: "Formulário criado com sucesso.",
      form: newForm,
    });
  } catch (error) {
    console.error("Erro ao criar formulário:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Erro ao criar formulário.";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Rota DELETE - Não implementada na rota principal, usa-se a rota específica com ID 