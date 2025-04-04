const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verificando tabela de aplicações...');
    
    // Verificar se a tabela existe
    try {
      const count = await prisma.application.count();
      console.log(`Total de aplicações: ${count}`);
      
      // Verificar estrutura da tabela
      console.log('Verificando a primeira aplicação (se existir)...');
      if (count > 0) {
        const firstApp = await prisma.application.findFirst({
          include: {
            submitter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });
        
        console.log('Estrutura da primeira aplicação:', JSON.stringify(firstApp, null, 2));
      }
      
      // Tentar criar uma aplicação de teste
      console.log('Tentando criar uma aplicação de teste...');
      
      // Primeiro, verificar se temos um usuário para ser o submitter
      const testUser = await prisma.user.findFirst();
      
      if (!testUser) {
        console.log('Nenhum usuário encontrado para criar a aplicação de teste. Criando um usuário...');
        await prisma.user.create({
          data: {
            name: 'Usuário Teste',
            email: 'teste@example.com',
            password: '123456', // Na produção, deve-se usar hash
            role: 'USER'
          }
        });
        console.log('Usuário de teste criado');
      }
      
      // Buscar o usuário novamente
      const submitter = await prisma.user.findFirst();
      
      if (submitter) {
        const testApplication = await prisma.application.create({
          data: {
            name: 'Aplicação de Teste Script',
            description: 'Esta aplicação foi criada por um script para testar a funcionalidade.',
            type: 'WEB',
            url: 'https://example.com',
            status: 'Pendente',
            submitterId: submitter.id
          }
        });
        
        console.log('Aplicação de teste criada com sucesso:', testApplication);
        
        // Remover a aplicação de teste
        await prisma.application.delete({
          where: {
            id: testApplication.id
          }
        });
        
        console.log('Aplicação de teste removida.');
      } else {
        console.log('Não foi possível encontrar um usuário para criar a aplicação de teste.');
      }
      
    } catch (err) {
      console.error('Erro ao verificar tabela de aplicações:', err);
      
      // Verificar se é um erro de tabela não existente
      if (err.message.includes('does not exist')) {
        console.log('A tabela Application não existe. Você precisa executar a migração do Prisma:');
        console.log('npx prisma migrate dev');
      }
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 