const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    // Criar usuário de teste com senha simples
    const testEmail = 'teste@exemplo.com';
    const testPassword = '123456';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    let user;
    
    if (existingUser) {
      // Atualizar usuário existente
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: 'Usuário Teste',
          password: hashedPassword,
          role: 'USER'
        }
      });
      console.log('Usuário de teste já existia, foi atualizado');
    } else {
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          name: 'Usuário Teste',
          email: testEmail,
          password: hashedPassword,
          role: 'USER'
        }
      });
      console.log('Novo usuário de teste criado');
    }
    
    console.log('Usuário de teste configurado com sucesso:');
    console.log({
      id: user.id,
      email: user.email,
      role: user.role
    });
    console.log('Credenciais para login:');
    console.log(`Email: ${testEmail}`);
    console.log(`Senha: ${testPassword}`);
    
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 