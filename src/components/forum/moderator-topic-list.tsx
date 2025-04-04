"use client";

import { useState, useEffect } from "react";
import { MoreVertical, AlertCircle, Search, Pin, Lock } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ForumTopic } from "@/types";

export function ModeratorTopicList() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);

  // Simular a busca de tópicos para moderação
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // Em produção, usar a API real
        // const response = await fetch("/api/forum/topics?moderation=true");
        // const data = await response.json();
        
        // Dados de exemplo
        const exampleTopics: ForumTopic[] = [
          {
            id: "1",
            title: "Dicas de usabilidade para interfaces mobile",
            content: "Compartilhando algumas dicas que aprendi sobre usabilidade em interfaces mobile. O que vocês acham?",
            createdAt: new Date(2023, 10, 10),
            updatedAt: new Date(2023, 10, 10),
            authorId: "user1",
            author: {
              id: "user1",
              name: "João Silva",
              email: "joao@example.com",
            },
            categoryId: "1",
            category: {
              id: "1",
              name: "Usabilidade Mobile",
            },
            isPinned: true,
            isClosed: false,
            responseCount: 5,
          },
          {
            id: "2",
            title: "Acessibilidade em aplicações web",
            content: "Quais são as melhores práticas de acessibilidade para aplicações web em 2023?",
            createdAt: new Date(2023, 10, 12),
            updatedAt: new Date(2023, 10, 15),
            authorId: "user2",
            author: {
              id: "user2",
              name: "Maria Oliveira",
              email: "maria@example.com",
            },
            categoryId: "2",
            category: {
              id: "2",
              name: "Acessibilidade",
            },
            isPinned: false,
            isClosed: false,
            responseCount: 3,
          },
          {
            id: "3",
            title: "Discussão sobre testes de usabilidade remotos",
            content: "Como vocês têm realizado testes de usabilidade remotos durante a pandemia?",
            createdAt: new Date(2023, 10, 5),
            updatedAt: new Date(2023, 10, 8),
            authorId: "user3",
            author: {
              id: "user3",
              name: "Carlos Souza",
              email: "carlos@example.com",
            },
            categoryId: "3",
            category: {
              id: "3",
              name: "Métodos de Pesquisa",
            },
            isPinned: false,
            isClosed: true,
            responseCount: 12,
          },
        ];
        
        setTopics(exampleTopics);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar tópicos:", err);
        setError("Não foi possível carregar os tópicos. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Atualizar a lista de tópicos
  const refreshTopics = async () => {
    try {
      setLoading(true);
      // Em produção, usar a API real
      // const response = await fetch("/api/forum/topics?moderation=true");
      // const data = await response.json();
      // setTopics(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Erro ao atualizar tópicos:", err);
      setError("Não foi possível atualizar os tópicos. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Fixar ou desfixar um tópico
  const togglePinTopic = async (topicId: string, currentState: boolean) => {
    try {
      // Em produção, usar a API real
      // await fetch(`/api/forum/topics/${topicId}/pin`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ isPinned: !currentState }),
      // });
      
      // Simulação
      setTopics(topics.map(topic => 
        topic.id === topicId ? { ...topic, isPinned: !currentState } : topic
      ));
      
      // Mostrar alguma notificação de sucesso
    } catch (err) {
      console.error("Erro ao alterar o status do tópico:", err);
      // Mostrar alguma notificação de erro
    }
  };

  // Fechar ou abrir um tópico
  const toggleCloseTopic = async (topicId: string, currentState: boolean) => {
    try {
      // Em produção, usar a API real
      // await fetch(`/api/forum/topics/${topicId}/close`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ isClosed: !currentState }),
      // });
      
      // Simulação
      setTopics(topics.map(topic => 
        topic.id === topicId ? { ...topic, isClosed: !currentState } : topic
      ));
      
      // Mostrar alguma notificação de sucesso
    } catch (err) {
      console.error("Erro ao alterar o status do tópico:", err);
      // Mostrar alguma notificação de erro
    }
  };

  // Remover um tópico
  const deleteTopic = async (topicId: string) => {
    try {
      // Em produção, usar a API real
      // await fetch(`/api/forum/topics/${topicId}`, {
      //   method: "DELETE",
      // });
      
      // Simulação
      setTopics(topics.filter(topic => topic.id !== topicId));
      setOpenAlert(false);
      setTopicToDelete(null);
      
      // Mostrar alguma notificação de sucesso
    } catch (err) {
      console.error("Erro ao remover tópico:", err);
      // Mostrar alguma notificação de erro
    }
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };

  // Filtragem de tópicos
  const filteredTopics = topics.filter(topic => {
    const query = searchQuery.toLowerCase();
    const title = topic.title.toLowerCase();
    const content = topic.content.toLowerCase();
    const authorName = topic.author?.name?.toLowerCase() || "";
    const categoryName = topic.category?.name?.toLowerCase() || "";
    
    return title.includes(query) || 
           content.includes(query) || 
           authorName.includes(query) || 
           categoryName.includes(query);
  });

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4 border border-red-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar tópicos..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshTopics}
          disabled={loading}
        >
          Atualizar
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Carregando tópicos...</div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Nenhum tópico encontrado.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Título</TableHead>
                <TableHead className="w-[160px]">Categoria</TableHead>
                <TableHead className="w-[160px]">Autor</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Respostas</TableHead>
                <TableHead className="w-[160px]">Data</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">
                    {topic.isPinned && (
                      <Badge variant="outline" className="mr-2 bg-blue-50">
                        <Pin className="h-3 w-3 mr-1" /> Fixado
                      </Badge>
                    )}
                    {topic.title}
                  </TableCell>
                  <TableCell>{topic.category?.name || "Sem categoria"}</TableCell>
                  <TableCell>{topic.author?.name || "Usuário desconhecido"}</TableCell>
                  <TableCell>
                    {topic.isClosed ? (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Lock className="h-3 w-3 mr-1" /> Fechado
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aberto
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{topic.responseCount || 0}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(topic.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/forum/topics/${topic.id}`, "_blank")}
                        >
                          Ver tópico
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePinTopic(topic.id, topic.isPinned)}>
                          {topic.isPinned ? "Desafixar tópico" : "Fixar tópico"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleCloseTopic(topic.id, topic.isClosed)}>
                          {topic.isClosed ? "Reabrir tópico" : "Fechar tópico"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setTopicToDelete(topic.id);
                            setOpenAlert(true);
                          }}
                        >
                          Remover tópico
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo de confirmação para remoção */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O tópico e todas as suas respostas serão permanentemente removidos do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => topicToDelete && deleteTopic(topicToDelete)} className="bg-red-600">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 