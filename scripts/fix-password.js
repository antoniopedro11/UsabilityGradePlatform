const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    // Hash da senha usando bcrypt
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Atualizar a senha do usuário admin
    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin@example.com'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('Senha do usuário atualizada com sucesso:');
    console.log(`Email: ${updatedUser.email}`);
    console.log('Nova senha: 123456');
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 