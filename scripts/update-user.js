const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pegar email do usuário a ser promovido dos argumentos da linha de comando
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Por favor, forneça o email do usuário a ser promovido.');
  console.log('Uso: node scripts/update-user.js email@example.com');
  process.exit(1);
}

async function main() {
  try {
    console.log(`Procurando usuário com email: ${userEmail}`);
    
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });
    
    if (!user) {
      console.log(`Usuário com email ${userEmail} não encontrado.`);
      return;
    }
    
    console.log('Usuário encontrado:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    // Verificar se já é administrador
    if (user.role === 'ADMIN') {
      console.log('Este usuário já é um administrador.');
      return;
    }
    
    // Promover a administrador
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        role: 'ADMIN'
      }
    });
    
    console.log('Usuário promovido a administrador com sucesso:');
    console.log({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 