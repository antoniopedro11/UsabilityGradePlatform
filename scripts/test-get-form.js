const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fetch = require('node-fetch');

async function main() {
  try {
    console.log('Teste de obtenção de formulário...');

    // Buscar um formulário do banco de dados
    const form = await prisma.form.findFirst({
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!form) {
      console.log('Nenhum formulário encontrado no banco de dados.');
      return;
    }

    console.log('Formulário encontrado no banco de dados:');
    console.log('ID:', form.id);
    console.log('Título:', form.title);
    console.log('Número de perguntas:', form.questions.length);
    
    // Detalhes da primeira pergunta
    if (form.questions.length > 0) {
      const question = form.questions[0];
      console.log('\nPrimeira pergunta:');
      console.log('ID:', question.id);
      console.log('Texto:', question.text);
      console.log('Tipo:', question.type);
      console.log('Opções:', question.options.map(o => o.text));
    }
    
    // Agora tenta obter o mesmo formulário via API
    console.log(`\nTentando obter o formulário via API (ID: ${form.id})...`);
    
    // Note que este teste só funcionará se o servidor estiver rodando
    // Na prática, precisaríamos iniciar o servidor ou usar uma biblioteca de teste HTTP
    try {
      const response = await fetch(`http://localhost:3000/api/admin/forms/${form.id}`);
      const data = await response.json();
      
      console.log('Resposta da API:');
      console.log('Status:', response.status);
      console.log('Sucesso:', response.ok);
      
      if (response.ok) {
        console.log('Formulário obtido da API:');
        console.log('ID:', data.id);
        console.log('Título:', data.title);
        console.log('Número de perguntas:', data.questions.length);
        
        // Verifica se os IDs são iguais
        console.log('\nVerificação:');
        console.log('IDs são iguais?', data.id === form.id);
        console.log('Títulos são iguais?', data.title === form.title);
      } else {
        console.log('Erro ao obter formulário:', data.error);
      }
    } catch (fetchError) {
      console.error('Erro na requisição fetch:', fetchError.message);
      console.log('Provavelmente o servidor não está rodando na porta 3000.');
    }

  } catch (error) {
    console.error('Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 