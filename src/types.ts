// Tipos para o sistema de fórum

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  slug: string;
  authorId: string;
  categoryId: string;
  isPinned: boolean;
  isClosed: boolean;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  category?: ForumCategory;
}

export interface ForumResponse {
  id: string;
  content: string;
  authorId: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  topic?: {
    id: string;
    title: string;
    slug: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

// Tipos para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin' | 'moderator';
}

// Tipos para esquema de autorização
export type UserRole = 'user' | 'admin' | 'moderator';

export interface AuthorizedProps {
  requiredRole: UserRole | UserRole[];
} 