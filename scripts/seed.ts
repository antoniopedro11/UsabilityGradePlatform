import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar banco de dados (opcional)
  console.log('Limpando banco de dados...');
  await prisma.user.deleteMany({});

  // Criar usuário administrador
  console.log('Criando usuário administrador...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Usuário administrador criado:', admin);

  // Criar usuário comum
  console.log('Criando usuário comum...');
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Usuário comum criado:', user);

  console.log('Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao popular o banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 