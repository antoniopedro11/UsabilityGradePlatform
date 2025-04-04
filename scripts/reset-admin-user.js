const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando reset do usuário admin...');
    
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    // Gerar senha hash
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    if (existingUser) {
      // Atualizar usuário existente
      console.log('Usuário admin encontrado, atualizando...');
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: 'Administrador',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
    } else {
      // Criar novo usuário admin
      console.log('Usuário admin não encontrado, criando novo...');
      await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
    }
    
    // Verificar usuário
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    console.log('Usuário admin configurado com sucesso:');
    console.log(user);
    console.log('Email: admin@example.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro ao resetar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 