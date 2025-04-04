const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Criando formulário de teste...');

    // Criar um usuário admin se não existir
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!admin) {
      console.log('Criando usuário admin...');
      admin = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@example.com',
          password: 'admin123',  // Em produção, isso deve ser hasheado
          role: 'ADMIN'
        }
      });
      console.log('Usuário admin criado:', admin.id);
    } else {
      console.log('Usuário admin encontrado:', admin.id);
    }

    // Criar formulário de teste
    const form = await prisma.form.create({
      data: {
        title: 'Formulário de Teste de Usabilidade',
        description: 'Este é um formulário de teste para diagnóstico da aplicação',
        category: 'web',
        status: 'PUBLISHED',
        creatorId: admin.id,
        questions: {
          create: [
            {
              text: 'Como você avalia a facilidade de uso deste site?',
              type: 'SCALE',
              required: true,
              order: 0
            },
            {
              text: 'Quais elementos da interface você achou mais difíceis de usar?',
              type: 'TEXTAREA',
              required: false,
              order: 1
            },
            {
              text: 'Qual dispositivo você utilizou para acessar o site?',
              type: 'RADIO',
              required: true,
              order: 2,
              options: {
                create: [
                  { text: 'Desktop', order: 0 },
                  { text: 'Tablet', order: 1 },
                  { text: 'Smartphone', order: 2 }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('Formulário de teste criado com sucesso:');
    console.log('ID:', form.id);
    console.log('Título:', form.title);
    console.log('Categoria:', form.category);
    console.log('Status:', form.status);

  } catch (error) {
    console.error('Erro ao criar formulário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 