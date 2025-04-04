import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("API: Iniciando seed de usuários");
    
    // Verificar se já existe um administrador
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: "admin@example.com",
        role: "ADMIN"
      }
    });
    
    if (existingAdmin) {
      console.log("API: Um administrador já existe:", existingAdmin.email);
      return NextResponse.json({
        message: "Usuário administrador já existe",
        user: {
          id: existingAdmin.id,
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    // Senha hash para "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Criar um usuário administrador
    const adminUser = await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    
    console.log("API: Usuário administrador criado com sucesso:", adminUser.email);
    
    // Criar um usuário normal para testes
    const normalUser = await prisma.user.create({
      data: {
        name: "Usuário Teste",
        email: "user@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "USER"
      }
    });
    
    console.log("API: Usuário normal criado com sucesso:", normalUser.email);
    
    return NextResponse.json({
      message: "Seed executado com sucesso",
      users: [
        {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        },
        {
          id: normalUser.id,
          name: normalUser.name,
          email: normalUser.email,
          role: normalUser.role
        }
      ]
    });
    
  } catch (error) {
    console.error("API: Erro ao realizar seed:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuários de seed" },
      { status: 500 }
    );
  }
} 