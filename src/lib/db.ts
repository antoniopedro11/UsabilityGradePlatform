import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Exportar como db para manter a consistência com as rotas de API
export const db = prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 