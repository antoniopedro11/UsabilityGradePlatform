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
- SQLite (desenvolvimento)
- Tailwind CSS
- Shadcn UI

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositório]
cd usabilitygradeplatform
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Execute os scripts de seed para popular o banco de dados com dados iniciais:
```bash
npx prisma db seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

6. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação
- `/src/components` - Componentes React reutilizáveis
- `/prisma` - Esquema do banco de dados e migrações
- `/public` - Arquivos estáticos

## Licença

Este projeto está licenciado sob a licença MIT. 