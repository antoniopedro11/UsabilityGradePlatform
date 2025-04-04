"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, Flag, MessageSquare, Shield, Trash2, UserX } from "lucide-react";

// Tipos de dados mockados
type ReportReason = 
  | "inappropriate" 
  | "spam" 
  | "offensive" 
  | "harassment" 
  | "misinformation"
  | "other";

interface ReportedContent {
  id: string;
  type: "topic" | "post";
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  reportCount: number;
  reportReasons: ReportReason[];
  createdAt: string;
  reportedAt: string;
}

// Dados mockados
const mockReportedContent: ReportedContent[] = [
  {
    id: "1",
    type: "topic",
    title: "Como melhorar a usabilidade do meu site?",
    content: "Tenho um site de e-commerce e estou tendo problemas com a taxa de conversão. Os usuários parecem abandonar o carrinho durante o processo de checkout. Alguém pode me dar dicas para melhorar a usabilidade nesse ponto crítico?",
    authorName: "MariaS",
    reportCount: 3,
    reportReasons: ["spam", "misinformation"],
    createdAt: "2023-03-10T14:30:00Z",
    reportedAt: "2023-03-12T08:45:00Z",
  },
  {
    id: "2",
    type: "post",
    title: "Re: Dúvida sobre acessibilidade",
    content: "Isso é uma completa perda de tempo! Acessibilidade só serve para complicar o desenvolvimento. Ninguém usa leitores de tela mesmo...",
    authorName: "JoaoD",
    authorAvatar: "/avatars/joao.png",
    reportCount: 5,
    reportReasons: ["offensive", "harassment", "misinformation"],
    createdAt: "2023-03-11T09:15:00Z",
    reportedAt: "2023-03-11T10:20:00Z",
  },
  {
    id: "3",
    type: "post",
    title: "Re: Feedback sobre meu portfólio",
    content: "Visite meu site para ver modelos profissionais: https://spam-site-example.com. 70% de desconto hoje! Aproveite essa oferta exclusiva para melhorar seu portfólio.",
    authorName: "AnaSilva",
    reportCount: 7,
    reportReasons: ["spam", "inappropriate"],
    createdAt: "2023-03-09T16:45:00Z",
    reportedAt: "2023-03-09T17:30:00Z",
  },
  {
    id: "4",
    type: "topic",
    title: "URGENTE!! Problemas de segurança no site",
    content: "ALERTA DE SEGURANÇA! O site está com falha de segurança que expõe todos os dados dos usuários! Se você inseriu seus dados recentemente, cancele seus cartões imediatamente!!!",
    authorName: "HackerAlert",
    reportCount: 8,
    reportReasons: ["misinformation", "inappropriate", "other"],
    createdAt: "2023-03-12T07:30:00Z",
    reportedAt: "2023-03-12T07:35:00Z",
  },
];

function getReasonLabel(reason: ReportReason): string {
  const labels: Record<ReportReason, string> = {
    inappropriate: "Conteúdo Inapropriado",
    spam: "Spam",
    offensive: "Conteúdo Ofensivo",
    harassment: "Assédio",
    misinformation: "Informação Falsa",
    other: "Outro",
  };
  return labels[reason];
}

function getReasonColor(reason: ReportReason): string {
  const colors: Record<ReportReason, string> = {
    inappropriate: "bg-yellow-100 text-yellow-800",
    spam: "bg-purple-100 text-purple-800",
    offensive: "bg-red-100 text-red-800",
    harassment: "bg-red-100 text-red-800",
    misinformation: "bg-blue-100 text-blue-800",
    other: "bg-gray-100 text-gray-800",
  };
  return colors[reason];
}

export function ReportedContentList() {
  const { toast } = useToast();
  const [reportedItems, setReportedItems] = useState<ReportedContent[]>(mockReportedContent);
  const [selectedItem, setSelectedItem] = useState<ReportedContent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState<string>("dismiss");
  const [moderationNote, setModerationNote] = useState<string>("");
  const [isModerating, setIsModerating] = useState(false);

  const handleViewContent = (item: ReportedContent) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleModerateContent = (item: ReportedContent) => {
    setSelectedItem(item);
    setActionDialogOpen(true);
    setModerationAction("dismiss");
    setModerationNote("");
  };

  const handleDeleteContent = (item: ReportedContent) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmModeration = async () => {
    if (!selectedItem) return;
    
    setIsModerating(true);

    try {
      // Aqui iria a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando a requisição

      // Remover o item da lista após a moderação
      setReportedItems(reportedItems.filter(item => item.id !== selectedItem.id));
      
      // Feedback ao usuário
      let actionMessage = "";
      switch (moderationAction) {
        case "dismiss":
          actionMessage = "Denúncias ignoradas";
          break;
        case "warn":
          actionMessage = "Aviso enviado ao autor";
          break;
        case "hide":
          actionMessage = "Conteúdo oculto";
          break;
        case "ban":
          actionMessage = "Usuário banido temporariamente";
          break;
      }
      
      toast({
        title: "Moderação concluída",
        description: `${actionMessage} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na moderação",
        description: "Não foi possível processar esta ação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsModerating(false);
      setActionDialogOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsModerating(true);

    try {
      // Aqui iria a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando a requisição

      // Remover o item da lista
      setReportedItems(reportedItems.filter(item => item.id !== selectedItem.id));
      
      toast({
        title: "Conteúdo removido",
        description: "O conteúdo foi removido permanentemente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover este conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsModerating(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (reportedItems.length === 0) {
    return (
      <div className="text-center py-10 space-y-4 border rounded-lg">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhum conteúdo reportado</h3>
        <p className="text-muted-foreground">
          Não há conteúdo reportado por usuários para ser revisado no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200 mb-4">
        <div className="flex items-start">
          <Flag className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Conteúdo Reportado Pendente
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Há {reportedItems.length} itens reportados aguardando revisão. A moderação rápida ajuda a manter a qualidade das discussões.
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Tipo</TableHead>
            <TableHead className="w-[250px]">Conteúdo</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Motivos</TableHead>
            <TableHead className="w-[120px]">Denúncias</TableHead>
            <TableHead className="w-[180px]">Reportado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge variant={item.type === "topic" ? "outline" : "secondary"}>
                  {item.type === "topic" ? "Tópico" : "Resposta"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium truncate max-w-[250px]">
                {item.title}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {item.authorAvatar && <AvatarImage src={item.authorAvatar} alt={item.authorName} />}
                    <AvatarFallback>{item.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{item.authorName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.reportReasons.map((reason, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-0.5 text-xs rounded-full ${getReasonColor(reason)}`}
                    >
                      {getReasonLabel(reason)}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className={`font-medium ${
                item.reportCount >= 5 ? 'text-red-600' : 
                item.reportCount >= 3 ? 'text-amber-600' : 'text-muted-foreground'
              }`}>
                {item.reportCount}
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(item.reportedAt)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewContent(item)}
                    title="Visualizar conteúdo"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleModerateContent(item)}
                    title="Moderar conteúdo"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteContent(item)}
                    className="text-destructive hover:text-destructive"
                    title="Remover conteúdo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Diálogo para visualização do conteúdo */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              Por <span className="font-medium">{selectedItem?.authorName}</span> 
              <span className="text-muted-foreground text-xs">
                {selectedItem && formatDate(selectedItem.createdAt)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-4 bg-muted/50 whitespace-pre-wrap">
            {selectedItem?.content}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Motivos das denúncias:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedItem?.reportReasons.map((reason, index) => (
                <Badge key={index} variant="outline">
                  {getReasonLabel(reason)}
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (selectedItem) handleModerateContent(selectedItem);
            }}>
              Moderar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para ações de moderação */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Moderar Conteúdo</DialogTitle>
            <DialogDescription>
              Escolha a ação a ser tomada para este conteúdo reportado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ação de Moderação</label>
              <Select 
                defaultValue={moderationAction} 
                onValueChange={setModerationAction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dismiss">Ignorar Denúncias</SelectItem>
                  <SelectItem value="warn">Enviar Aviso ao Autor</SelectItem>
                  <SelectItem value="hide">Ocultar Conteúdo</SelectItem>
                  <SelectItem value="ban">Banir Usuário Temporariamente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nota de Moderação (opcional)</label>
              <Textarea 
                placeholder="Informe detalhes sobre esta decisão para referência futura..."
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)} disabled={isModerating}>
              Cancelar
            </Button>
            <Button onClick={confirmModeration} disabled={isModerating}>
              {isModerating ? "Processando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alerta para confirmação de remoção */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Conteúdo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover permanentemente este conteúdo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isModerating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isModerating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isModerating ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 