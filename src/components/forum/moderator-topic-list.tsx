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
import { toast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

export function ModeratorTopicList() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [actionTopic, setActionTopic] = useState<ForumTopic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/forum/topics?for=moderation");
      if (!response.ok) {
        throw new Error("Falha ao buscar tópicos para moderação");
      }
      const data = await response.json();
      setTopics(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar tópicos:", err);
      setError("Não foi possível carregar os tópicos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (topicId: string) => {
    try {
      const response = await fetch(`/api/forum/topics/moderate?id=${topicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao aprovar tópico");
      }

      // Atualizar o estado localmente
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic.id === topicId ? { ...topic, status: "approved" } : topic
        )
      );
      
      toast({
        title: "Tópico aprovado",
        description: "O tópico foi aprovado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao aprovar tópico:", err);
      toast({
        title: "Erro",
        description: "Falha ao aprovar tópico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (topicId: string) => {
    try {
      const response = await fetch(`/api/forum/topics/moderate?id=${topicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao rejeitar tópico");
      }

      // Atualizar o estado localmente
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic.id === topicId ? { ...topic, status: "rejected" } : topic
        )
      );
      
      toast({
        title: "Tópico rejeitado",
        description: "O tópico foi rejeitado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao rejeitar tópico:", err);
      toast({
        title: "Erro",
        description: "Falha ao rejeitar tópico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                    {topic.status === "pending" ? (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendente
                      </div>
                    ) : topic.status === "approved" ? (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aprovado
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Rejeitado
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{topic._count.responses || 0}</TableCell>
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