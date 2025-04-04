import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("API de Diagnóstico: Buscando usuários na base de dados Neon");
    
    // Buscar apenas dados básicos dos usuários para fins de diagnóstico
    // Excluindo informações sensíveis como a senha
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limitar a 20 usuários mais recentes
    });
    
    console.log(`API de Diagnóstico: Encontrados ${users.length} usuários na base de dados`);
    
    return NextResponse.json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error("Erro ao buscar usuários da base de dados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar usuários" },
      { status: 500 }
    );
  }
} 