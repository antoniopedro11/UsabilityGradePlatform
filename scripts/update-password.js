const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Atualizar senha do usuário admin
    const user = await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { password: hashedPassword }
    });
    
    console.log('Senha atualizada com sucesso para o usuário:', user.email);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 