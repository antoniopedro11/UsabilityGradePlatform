"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronDown, Eye, Pencil, Pin, PinOff, Search, Lock, Unlock, Trash2 } from "lucide-react";
import { ForumTopic } from "@/types";

export function AdminTopicList() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<ForumTopic | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Carregar tópicos
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/forum/topics");
        if (!response.ok) {
          throw new Error("Falha ao carregar tópicos");
        }
        const data = await response.json();
        setTopics(data);
      } catch (err) {
        setError("Erro ao carregar tópicos. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetch("/api/forum/topics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar tópicos");
        }
        return response.json();
      })
      .then((data) => {
        setTopics(data);
      })
      .catch((err) => {
        setError("Erro ao carregar tópicos. Tente novamente mais tarde.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (topic: ForumTopic) => {
    setTopicToDelete(topic);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!topicToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/forum/topics?id=${topicToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao excluir tópico");
      }

      toast({
        title: "Sucesso",
        description: "Tópico excluído com sucesso",
      });

      // Atualizar a lista de tópicos
      setTopics(topics.filter((t) => t.id !== topicToDelete.id));
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao excluir tópico",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTopicToDelete(null);
    }
  };

  const handlePinToggle = async (topic: ForumTopic) => {
    try {
      const response = await fetch(`/api/forum/topics?id=${topic.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          isPinned: !topic.isPinned 
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar tópico");
      }

      const updatedTopic = await response.json();
      setTopics(
        topics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
      );

      toast({
        title: "Sucesso",
        description: updatedTopic.isPinned 
          ? "Tópico fixado com sucesso" 
          : "Tópico desfixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao atualizar tópico",
        variant: "destructive",
      });
    }
  };

  const handleCloseToggle = async (topic: ForumTopic) => {
    try {
      const response = await fetch(`/api/forum/topics?id=${topic.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          isClosed: !topic.isClosed 
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar tópico");
      }

      const updatedTopic = await response.json();
      setTopics(
        topics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
      );

      toast({
        title: "Sucesso",
        description: updatedTopic.isClosed 
          ? "Tópico fechado com sucesso" 
          : "Tópico reaberto com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao atualizar tópico",
        variant: "destructive",
      });
    }
  };

  // Função para formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Filtragem por termo de busca
  const filteredTopics = topics.filter((topic) => {
    if (!searchQuery) return true;
    const searchTermLower = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(searchTermLower) ||
      topic.author?.name?.toLowerCase().includes(searchTermLower) ||
      topic.category?.name.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return <div className="text-center py-10">Carregando tópicos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleRefresh}>Tentar Novamente</Button>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-lg font-medium">Nenhum tópico encontrado</h3>
        <p className="text-muted-foreground mt-2">
          Não há tópicos cadastrados no fórum
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-6 gap-2">
        <Search className="text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Buscar tópicos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.title}</TableCell>
                <TableCell>{topic.category?.name}</TableCell>
                <TableCell>{topic.author?.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {topic.isPinned && (
                      <Badge variant="secondary">Fixado</Badge>
                    )}
                    {topic.isClosed && (
                      <Badge variant="outline">Fechado</Badge>
                    )}
                    {!topic.isPinned && !topic.isClosed && (
                      <Badge variant="default">Aberto</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(topic.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Abrir menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a 
                          href={`/forum/${topic.category?.slug}/${topic.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePinToggle(topic)}>
                        {topic.isPinned ? (
                          <>
                            <PinOff className="mr-2 h-4 w-4" />
                            <span>Desfixar</span>
                          </>
                        ) : (
                          <>
                            <Pin className="mr-2 h-4 w-4" />
                            <span>Fixar</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCloseToggle(topic)}>
                        {topic.isClosed ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            <span>Reabrir</span>
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            <span>Fechar</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(topic)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tópico</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tópico "{topicToDelete?.title}"? Esta ação excluirá todas as respostas associadas e não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 