import { PrismaClient } from "@prisma/client";

// Evite criar múltiplas instâncias do Prisma Client em desenvolvimento
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Tipos para os campos de recuperação de senha no usuário
declare module '@prisma/client' {
  interface User {
    resetCode?: string | null;
    resetCodeExpiry?: Date | null;
  }
}

/**
 * Funções relacionadas a usuários
 */
export const userDB = {
  /**
   * Encontra um usuário pelo email
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Encontra um usuário pelo ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  /**
   * Encontra um usuário pelo código de recuperação
   */
  async findByResetCode(resetCode: string) {
    return prisma.user.findFirst({
      where: { 
        // @ts-ignore - resetCode existe no banco, mas ainda não no tipo gerado
        resetCode 
      }
    });
  },

  /**
   * Gera um código de recuperação para um usuário
   */
  async createResetCode(email: string, resetCode: string, resetCodeExpiry: Date) {
    return prisma.user.update({
      where: { email },
      data: { 
        // @ts-ignore - resetCode e resetCodeExpiry existem no banco, mas ainda não no tipo gerado
        resetCode, 
        resetCodeExpiry 
      }
    });
  },

  /**
   * Altera a senha de um usuário
   */
  async resetPassword(userId: string, password: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { 
        password,
        // @ts-ignore - resetCode e resetCodeExpiry existem no banco, mas ainda não no tipo gerado
        resetCode: null,
        resetCodeExpiry: null
      }
    });
  },

  /**
   * Invalida um código de recuperação
   */
  async invalidateResetCode(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        // @ts-ignore - resetCode e resetCodeExpiry existem no banco, mas ainda não no tipo gerado
        resetCode: null,
        resetCodeExpiry: null
      }
    });
  }
}; 