const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Verificando tabelas no banco de dados...');
    
    // Consulta de metadados (SQLite)
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%';
    `;
    
    console.log('Tabelas no banco de dados:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
    // Verificar aplicações
    console.log('\nConsultando aplicações...');
    const applications = await prisma.application.findMany();
    
    console.log(`Encontradas ${applications.length} aplicações:`);
    applications.forEach(app => {
      console.log(`- ${app.id}: ${app.name} (${app.status})`);
    });
    
  } catch (error) {
    console.error('Erro ao verificar o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 