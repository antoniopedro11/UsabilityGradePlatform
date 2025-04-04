"use client";

import { useState, useEffect } from "react";
import { MoreVertical, AlertCircle, Check, X, Search } from "lucide-react";
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
import { ForumPost } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ModeratorPostList() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [viewResponse, setViewResponse] = useState<ForumPost | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Simular a busca de posts para moderação
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Em produção, usar a API real
        // const response = await fetch("/api/forum/posts?moderation=true");
        // const data = await response.json();
        
        // Dados de exemplo
        const examplePosts: ForumPost[] = [
          {
            id: "1",
            content: "Esta resposta contém informações importantes sobre usabilidade em interfaces mobile.",
            createdAt: new Date(2023, 10, 15),
            updatedAt: new Date(2023, 10, 15),
            authorId: "user1",
            author: {
              id: "user1",
              name: "João Silva",
              email: "joao@example.com",
            },
            topicId: "topic1",
            topic: {
              id: "topic1",
              title: "Dicas de usabilidade para interfaces mobile",
              createdAt: new Date(2023, 10, 10),
            },
            isApproved: true,
            isFlagged: false,
          },
          {
            id: "2",
            content: "Não concordo com o autor. Acho que essa abordagem não funciona bem em todos os casos.",
            createdAt: new Date(2023, 10, 16),
            updatedAt: new Date(2023, 10, 16),
            authorId: "user2",
            author: {
              id: "user2",
              name: "Maria Oliveira",
              email: "maria@example.com",
            },
            topicId: "topic1",
            topic: {
              id: "topic1",
              title: "Dicas de usabilidade para interfaces mobile",
              createdAt: new Date(2023, 10, 10),
            },
            isApproved: false,
            isFlagged: true,
            flagReason: "Conteúdo controverso",
          },
          {
            id: "3",
            content: "Gostaria de adicionar que existem diferentes padrões de usabilidade que variam conforme o público-alvo.",
            createdAt: new Date(2023, 10, 17),
            updatedAt: new Date(2023, 10, 17),
            authorId: "user3",
            author: {
              id: "user3",
              name: "Carlos Souza",
              email: "carlos@example.com",
            },
            topicId: "topic2",
            topic: {
              id: "topic2",
              title: "Acessibilidade em aplicações web",
              createdAt: new Date(2023, 10, 12),
            },
            isApproved: true,
            isFlagged: false,
          },
        ];
        
        setPosts(examplePosts);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Atualizar a lista de posts
  const refreshPosts = async () => {
    try {
      setLoading(true);
      // Em produção, usar a API real
      // const response = await fetch("/api/forum/posts?moderation=true");
      // const data = await response.json();
      // setPosts(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Erro ao atualizar posts:", err);
      setError("Não foi possível atualizar os posts. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Aprovar um post
  const approvePost = async (postId: string) => {
    try {
      // Em produção, usar a API real
      // await fetch(`/api/forum/posts/${postId}/approve`, {
      //   method: "PUT",
      // });
      
      // Simulação
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, isApproved: true, isFlagged: false, flagReason: undefined } : post
      ));
      
      // Mostrar alguma notificação de sucesso
    } catch (err) {
      console.error("Erro ao aprovar post:", err);
      // Mostrar alguma notificação de erro
    }
  };

  // Remover um post
  const deletePost = async (postId: string) => {
    try {
      // Em produção, usar a API real
      // await fetch(`/api/forum/posts/${postId}`, {
      //   method: "DELETE",
      // });
      
      // Simulação
      setPosts(posts.filter(post => post.id !== postId));
      setOpenAlert(false);
      setPostToDelete(null);
      
      // Mostrar alguma notificação de sucesso
    } catch (err) {
      console.error("Erro ao remover post:", err);
      // Mostrar alguma notificação de erro
    }
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };

  // Filtragem de posts
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    const content = post.content.toLowerCase();
    const authorName = post.author?.name?.toLowerCase() || "";
    const topicTitle = post.topic?.title?.toLowerCase() || "";
    
    return content.includes(query) || 
           authorName.includes(query) || 
           topicTitle.includes(query);
  });

  const handleViewResponse = (post: ForumPost) => {
    setViewResponse(post);
    setIsViewDialogOpen(true);
  };

  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/approve`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Falha ao aprovar post");
      }

      // Atualizar o estado localmente
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, isApproved: true, isFlagged: false, flagReason: undefined } : post
        )
      );
      
      toast({
        title: "Post aprovado",
        description: "O post foi aprovado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao aprovar post:", err);
      toast({
        title: "Erro",
        description: "Falha ao aprovar post. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/reject`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Falha ao rejeitar post");
      }

      // Atualizar o estado localmente
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, isApproved: false, isFlagged: true, flagReason: "Rejeitado pelo moderador" } : post
        )
      );
      
      toast({
        title: "Post rejeitado",
        description: "O post foi rejeitado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao rejeitar post:", err);
      toast({
        title: "Erro",
        description: "Falha ao rejeitar post. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Pendente</Badge>
    );
  };

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
            placeholder="Pesquisar respostas..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPosts}
          disabled={loading}
        >
          Atualizar
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Carregando respostas...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Nenhuma resposta encontrada.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Tópico</TableHead>
                <TableHead className="w-[200px]">Autor</TableHead>
                <TableHead>Conteúdo</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[160px]">Data</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium truncate max-w-[180px]">
                    {post.topic?.title || "Tópico desconhecido"}
                  </TableCell>
                  <TableCell>{post.author?.name || "Usuário desconhecido"}</TableCell>
                  <TableCell className="truncate max-w-[300px]">
                    {post.content}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(post.isApproved)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(post.createdAt)}
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
                          onClick={() => handleViewResponse(post)}
                        >
                          Ver no contexto
                        </DropdownMenuItem>
                        {!post.isApproved && (
                          <DropdownMenuItem onClick={() => handleApprove(post.id)}>
                            Aprovar resposta
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setPostToDelete(post.id);
                            setOpenAlert(true);
                          }}
                        >
                          Remover resposta
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
              Esta ação não pode ser desfeita. A resposta será permanentemente removida do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => postToDelete && deletePost(postToDelete)} className="bg-red-600">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog para visualizar a resposta completa */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Resposta</DialogTitle>
            <DialogDescription>
              Resposta em: <strong>{viewResponse?.topic?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Autor</h4>
              <p>{viewResponse?.author?.name}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Data</h4>
              <p>{viewResponse && formatDate(viewResponse.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Status</h4>
              <p>{getStatusBadge(viewResponse?.isApproved)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Conteúdo</h4>
              <div className="rounded-md border p-4 whitespace-pre-wrap">
                {viewResponse?.content}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {viewResponse?.isApproved === false && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600"
                    onClick={() => {
                      handleApprove(viewResponse.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => {
                      handleReject(viewResponse.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 