// Lista simulada de usuários para desenvolvimento
export interface MockUser {
  id: string; 
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  { 
    id: "1", 
    name: "Administrador", 
    email: "admin@example.com", 
    password: "admin123", 
    role: "admin",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
  },
  { 
    id: "2", 
    name: "Usuário Normal", 
    email: "user@example.com", 
    password: "user123", 
    role: "standard",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias atrás
  },
  { 
    id: "3", 
    name: "Maria Silva", 
    email: "maria@example.com", 
    password: "maria123", 
    role: "expert",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
  },
  { 
    id: "4", 
    name: "João Santos", 
    email: "joao@example.com", 
    password: "joao123", 
    role: "business",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
  },
  { 
    id: "5", 
    name: "Ana Ferreira", 
    email: "ana@example.com", 
    password: "ana123", 
    role: "standard",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
  },
  { 
    id: "6", 
    name: "Pedro Oliveira", 
    email: "pedro@example.com", 
    password: "pedro123", 
    role: "expert",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
  },
  { 
    id: "7", 
    name: "Carla Mendes", 
    email: "carla@example.com", 
    password: "carla123", 
    role: "business",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
  }
]; 