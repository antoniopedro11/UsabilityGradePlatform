const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Conectando ao banco de dados Neon...');
    
    const users = await prisma.user.findMany();
    
    console.log('Usuários encontrados:', users.length);
    console.log('Detalhes:');
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado. Criando usuário admin padrão...');
      
      const admin = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'ADMIN'
        }
      });
      
      console.log('Usuário admin criado:', admin);
    } else {
      console.log(JSON.stringify(users, null, 2));
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 