// Este arquivo cria e exporta uma única instância do Prisma Client

import { PrismaClient } from '@prisma/client'

// Criar uma única instância do Prisma Client para toda a aplicação
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

// Prevenir múltiplas instâncias em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Usar client existente ou criar um novo
export const prisma = globalForPrisma.prisma || new PrismaClient()

// Salvar referência no objeto global em ambiente de não-produção
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 