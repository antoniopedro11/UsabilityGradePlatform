const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeding da database...');

  try {
    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    // Criar admin padrão se não existir
    let adminId;
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      adminId = adminUser.id;
      console.log('Usuário admin criado com sucesso!');
    } else {
      adminId = existingAdmin.id;
      console.log('Usuário admin já existe, pulando criação');
    }

    // Verificar se o usuário padrão já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' },
    });

    // Criar usuário padrão se não existir
    let userId;
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      const regularUser = await prisma.user.create({
        data: {
          name: 'Usuário',
          email: 'user@example.com',
          password: hashedPassword,
          role: 'USER',
        },
      });
      userId = regularUser.id;
      console.log('Usuário padrão criado com sucesso!');
    } else {
      userId = existingUser.id;
      console.log('Usuário padrão já existe, pulando criação');
    }

    // Criar categorias de conhecimento
    const categoriasSeed = [
      { name: 'Usabilidade Web', description: 'Artigos sobre usabilidade na web' },
      { name: 'Acessibilidade', description: 'Informações sobre acessibilidade digital' },
      { name: 'Design UX', description: 'Princípios e práticas de design de experiência do usuário' }
    ];

    console.log('Criando categorias de conhecimento...');
    for (const categoria of categoriasSeed) {
      // Verificar se a categoria já existe
      const existingCategory = await prisma.knowledgeCategory.findFirst({
        where: { name: categoria.name },
      });

      if (!existingCategory) {
        await prisma.knowledgeCategory.create({
          data: categoria,
        });
        console.log(`Categoria '${categoria.name}' criada com sucesso!`);
      } else {
        console.log(`Categoria '${categoria.name}' já existe, pulando criação`);
      }
    }

    // Obter as categorias criadas/existentes
    const categorias = await prisma.knowledgeCategory.findMany();
    
    // Criar artigos de conhecimento
    const artigosSeed = [
      {
        title: 'Heurísticas de Nielsen',
        content: `As heurísticas de Nielsen são 10 princípios gerais para design de interfaces de usuário:\n\n1. Visibilidade do status do sistema\n2. Correspondência entre o sistema e o mundo real\n3. Controle e liberdade do usuário\n4. Consistência e padrões\n5. Prevenção de erros\n6. Reconhecimento em vez de lembrança\n7. Flexibilidade e eficiência\n8. Design estético e minimalista\n9. Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros\n10. Ajuda e documentação`,
        categoryId: categorias.find(c => c.name === 'Usabilidade Web')?.id
      },
      {
        title: 'Princípios WCAG',
        content: `Os princípios WCAG (Web Content Accessibility Guidelines) são diretrizes para tornar o conteúdo web mais acessível. Os quatro princípios básicos são:\n\n- Perceptível: As informações e os componentes da interface do usuário devem ser apresentáveis aos usuários de maneiras que eles possam perceber.\n\n- Operável: Os componentes de interface de usuário e a navegação devem ser operáveis.\n\n- Compreensível: As informações e a operação da interface do usuário devem ser compreensíveis.\n\n- Robusto: O conteúdo deve ser robusto o suficiente para que possa ser interpretado de forma confiável por uma ampla variedade de agentes de usuário, incluindo tecnologias assistivas.`,
        categoryId: categorias.find(c => c.name === 'Acessibilidade')?.id
      },
      {
        title: 'Design Centrado no Usuário',
        content: `O Design Centrado no Usuário (DCU) é uma abordagem de design que coloca as necessidades, desejos e limitações do usuário final em foco durante todo o processo de design e desenvolvimento. Os principais estágios do DCU são:\n\n1. Pesquisa e análise de usuários\n2. Design e prototipagem\n3. Avaliação e testes com usuários\n4. Implementação\n5. Monitoramento e evolução\n\nEsta metodologia garante que os produtos sejam úteis, usáveis e proporcionem experiências positivas aos usuários.`,
        categoryId: categorias.find(c => c.name === 'Design UX')?.id
      }
    ];

    console.log('Criando artigos de conhecimento...');
    for (const artigo of artigosSeed) {
      // Verificar se o artigo já existe
      const existingArticle = await prisma.knowledgeArticle.findFirst({
        where: { title: artigo.title },
      });

      if (!existingArticle) {
        await prisma.knowledgeArticle.create({
          data: artigo,
        });
        console.log(`Artigo '${artigo.title}' criado com sucesso!`);
      } else {
        console.log(`Artigo '${artigo.title}' já existe, pulando criação`);
      }
    }

    // Criar aplicações de exemplo
    const applicacoesSeed = [
      {
        name: 'Meu E-commerce',
        description: 'Uma loja online completa com carrinho de compras, pagamentos e área de cliente.',
        url: 'https://meu-ecommerce.example.com',
        type: 'WEB',
        status: 'PENDING',
        submitterId: userId,
        screenshots: 'https://via.placeholder.com/800x600?text=E-commerce+Homepage,https://via.placeholder.com/800x600?text=E-commerce+Product+Page'
      },
      {
        name: 'Aplicativo de Finanças',
        description: 'Um aplicativo mobile para controle financeiro pessoal, com gráficos e relatórios.',
        url: 'https://finance-app.example.com',
        type: 'MOBILE',
        status: 'IN_REVIEW',
        submitterId: userId,
        assignedReviewer: adminId,
        screenshots: 'https://via.placeholder.com/400x800?text=Finance+App+Dashboard'
      },
      {
        name: 'Dashboard Administrativo',
        description: 'Painel de controle para administradores com métricas de negócio e visualização de dados.',
        url: 'https://admin-dashboard.example.com',
        type: 'WEB',
        status: 'APPROVED',
        submitterId: adminId,
        assignedReviewer: adminId,
        feedback: 'Excelente trabalho! O dashboard tem uma organização clara e as funcionalidades são fáceis de encontrar. Recomendamos melhorar apenas o feedback visual ao realizar ações críticas.',
        screenshots: 'https://via.placeholder.com/1200x800?text=Admin+Dashboard,https://via.placeholder.com/1200x800?text=Data+Visualization'
      },
      {
        name: 'Aplicativo de Reservas',
        description: 'Sistema para agendamento de reservas em restaurantes e eventos.',
        url: 'https://booking-app.example.com',
        type: 'WEB',
        status: 'REJECTED',
        submitterId: userId,
        assignedReviewer: adminId,
        feedback: 'O fluxo de reserva é confuso e há muitas etapas desnecessárias. Recomendamos simplificar o processo e melhorar as mensagens de erro. Por favor, reenvie após as correções.',
        screenshots: 'https://via.placeholder.com/800x600?text=Booking+Form'
      }
    ];

    console.log('Criando aplicações de exemplo...');
    for (const app of applicacoesSeed) {
      // Verificar se a aplicação já existe pelo nome
      const existingApp = await prisma.application.findFirst({
        where: { name: app.name },
      });

      if (!existingApp) {
        await prisma.application.create({
          data: {
            ...app,
            createdAt: app.status === 'APPROVED' || app.status === 'REJECTED' 
              ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás para aprovadas/rejeitadas
              : new Date(),
            updatedAt: new Date()
          },
        });
        console.log(`Aplicação '${app.name}' criada com sucesso!`);
      } else {
        console.log(`Aplicação '${app.name}' já existe, pulando criação`);
      }
    }

    console.log('Seeding concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 