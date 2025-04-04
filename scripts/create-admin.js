const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  try {
    console.log('Conectando ao banco de dados Neon...');
    
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });
    
    if (existingAdmin) {
      console.log('Um administrador já existe:', existingAdmin.email);
      return;
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Criar administrador
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('Administrador criado com sucesso:');
    console.log({
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 