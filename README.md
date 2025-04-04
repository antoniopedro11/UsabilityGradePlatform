# Usability Grade Platform

Uma plataforma para avaliação e gestão de usabilidade de aplicações.

## Visão Geral

A Usability Grade Platform é uma aplicação web desenvolvida para facilitar a avaliação de usabilidade de sistemas e aplicações. A plataforma permite que usuários submetam aplicações para avaliação, revisem resultados e compartilhem conhecimentos sobre melhores práticas de usabilidade.

## Funcionalidades

- Gestão de aplicações para avaliação de usabilidade
- Painel administrativo para gerenciamento de usuários
- Base de conhecimento sobre usabilidade
- Fórum para discussão e compartilhamento de experiências

## Tecnologias Utilizadas

- Next.js 14
- React
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Tailwind CSS
- Shadcn UI
- Lucide Icons

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/usabilitygradeplatform.git
cd usabilitygradeplatform
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o arquivo .env com suas variáveis de ambiente:
```
DATABASE_URL="postgresql://seu-usuario:senha@host:5432/nome-do-banco"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

4. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Execute os scripts de seed para popular o banco de dados com dados iniciais:
```bash
npm run seed
# ou
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

7. Acesse a aplicação em `http://localhost:3000`

## Usuários para Teste

- **Administrador**:
  - Email: admin@example.com
  - Senha: admin123

- **Usuário comum**:
  - Email: teste@exemplo.com
  - Senha: 123456

## Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação (App Router do Next.js)
- `/src/components` - Componentes React reutilizáveis
- `/src/lib` - Funções de utilidade e configurações
- `/prisma` - Esquema do banco de dados e migrações
- `/public` - Arquivos estáticos
- `/scripts` - Scripts utilitários para o projeto

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. 