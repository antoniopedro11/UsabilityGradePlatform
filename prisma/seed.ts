import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeding da database...');

  // Verificar se já existe usuário admin
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });

  if (!adminExists) {
    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        id: '1', // Mesmo ID usado nas implementações mockadas
        name: 'Administrador',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Usuário admin criado com sucesso!');
  } else {
    console.log('Usuário admin já existe, pulando criação');
  }

  // Verificar se já existe usuário padrão
  const userExists = await prisma.user.findUnique({
    where: { email: 'user@example.com' }
  });

  if (!userExists) {
    // Criar usuário padrão
    const hashedPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        id: '2', // Mesmo ID usado nas implementações mockadas
        name: 'Usuário Normal',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
      },
    });
    console.log('Usuário padrão criado com sucesso!');
  } else {
    console.log('Usuário padrão já existe, pulando criação');
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 