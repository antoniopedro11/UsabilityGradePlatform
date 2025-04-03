# UsabilityGrade Platform

Uma plataforma completa para avaliar a usabilidade e acessibilidade de aplicações web e móveis.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento web
- **TypeScript**: Linguagem tipada para desenvolvimento seguro
- **Tailwind CSS**: Framework de CSS utilitário
- **Shadcn UI**: Biblioteca de componentes de UI
- **Neon PostgreSQL**: Banco de dados PostgreSQL serverless
- **Prisma**: ORM para interação com o banco de dados
- **NextAuth.js**: Autenticação completa para Next.js

## Funcionalidades

- Autenticação de usuários (login/registro)
- Gerenciamento de projetos
- Criação de avaliações de usabilidade
- Definição de critérios de avaliação
- Gerenciamento de tarefas
- Análise de resultados

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/plataforma-avaliacao-usabilidade.git
cd plataforma-avaliacao-usabilidade

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Copie o arquivo .env.example e renomeie para .env
# Preencha as variáveis necessárias

# Sincronize o banco de dados
npx prisma db push

# Execute o servidor de desenvolvimento
npm run dev
```

## Estrutura de Dados

A plataforma usa os seguintes modelos de dados:

- **User**: Usuários da plataforma
- **Project**: Projetos de avaliação
- **Membership**: Associações de usuários a projetos
- **Checklist**: Listas de critérios para avaliação
- **Criterion**: Critérios individuais de avaliação
- **Evaluation**: Avaliações realizadas
- **EvaluationResult**: Resultados de avaliação para cada critério
- **Task**: Tarefas associadas a avaliações
- **Comment**: Comentários em tarefas
- **Webpage**: Páginas web para avaliação

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Implantação com GitLab CI/CD

Este projeto está configurado para usar GitLab CI/CD para implantação automática. O pipeline inclui as seguintes etapas:

1. **Build**: Compila a aplicação usando Next.js
2. **Test**: Executa os testes automáticos (quando implementados)
3. **Deploy**: Implanta a aplicação em um ambiente de produção

### Requisitos para implantação

- Node.js 18 ou superior
- Acesso ao repositório GitLab
- Variáveis de ambiente configuradas no GitLab CI/CD

### Como implantar

1. Clone o repositório: `git clone https://gitlab.com/seu-usuario/usabilitygradeplatform.git`
2. Configure as variáveis de ambiente no GitLab
3. Faça push para a branch main para disparar o pipeline de CI/CD

## Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente:

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secret-value"
```

Configure estas variáveis no arquivo `.env` local e nas configurações CI/CD do GitLab para implantação.
