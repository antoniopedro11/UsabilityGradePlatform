export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
}

export type UserType = "admin" | "user" | "evaluator"; 

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    topics: number;
  };
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isPinned: boolean;
  isClosed: boolean;
  responseCount: number;
}

export interface ForumResponse {
  id: string;
  content: string;
  topicId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    image?: string;
  };
  topic?: {
    title: string;
    slug: string;
    category: {
      name: string;
      slug: string;
    };
  };
}

export interface ForumPost {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
  topicId: string;
  topic?: {
    id: string;
    title: string;
    createdAt: Date;
  };
  isApproved: boolean;
  isFlagged: boolean;
  flagReason?: string;
} 