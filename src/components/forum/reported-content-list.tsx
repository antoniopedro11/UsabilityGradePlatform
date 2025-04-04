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
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

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
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewReport, setViewReport] = useState<ReportedContent | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/forum/reports");
      if (!response.ok) {
        throw new Error("Falha ao buscar conteúdo reportado");
      }
      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar conteúdo reportado:", err);
      setError("Não foi possível carregar o conteúdo reportado. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: ReportedContent) => {
    setViewReport(report);
    setIsViewDialogOpen(true);
  };

  const handleResolve = async (reportId: string) => {
    try {
      const response = await fetch(`/api/forum/reports/${reportId}/resolve`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Falha ao resolver denúncia");
      }

      // Atualizar o estado localmente
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: 'resolved' } : report
        )
      );
      
      toast({
        title: "Denúncia resolvida",
        description: "A denúncia foi marcada como resolvida.",
      });
    } catch (err) {
      console.error("Erro ao resolver denúncia:", err);
      toast({
        title: "Erro",
        description: "Falha ao resolver denúncia. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = async (reportId: string) => {
    try {
      const response = await fetch(`/api/forum/reports/${reportId}/dismiss`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Falha ao dispensar denúncia");
      }

      // Atualizar o estado localmente
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: 'dismissed' } : report
        )
      );
      
      toast({
        title: "Denúncia dispensada",
        description: "A denúncia foi marcada como dispensada.",
      });
    } catch (err) {
      console.error("Erro ao dispensar denúncia:", err);
      toast({
        title: "Erro",
        description: "Falha ao dispensar denúncia. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  // Truncar texto longo
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Carregando denúncias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={fetchReports} 
          variant="outline" 
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {reports.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma denúncia encontrada.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Razão</TableHead>
                <TableHead>Reportado por</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {report.type === 'topic' ? 'Tópico' : 'Resposta'}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {truncateText(report.title)}
                  </TableCell>
                  <TableCell>{report.authorName}</TableCell>
                  <TableCell>
                    {report.status === 'pending' ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>
                    ) : report.status === 'resolved' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvido</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Dispensado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {report.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleResolve(report.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-600"
                            onClick={() => handleDismiss(report.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Dialog para visualizar a denúncia completa */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Denúncia</DialogTitle>
            <DialogDescription>
              Tipo: <strong>{viewReport?.type === 'topic' ? 'Tópico' : 'Resposta'}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Reportado por</h4>
              <p>{viewReport?.authorName}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Data</h4>
              <p>{viewReport && formatDate(viewReport.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Status</h4>
              <p>
                {viewReport?.status === 'pending' ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>
                ) : viewReport?.status === 'resolved' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvido</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Dispensado</Badge>
                )}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Motivo da denúncia</h4>
              <div className="rounded-md border p-4 whitespace-pre-wrap">
                {viewReport?.reportReasons.map(reason => getReasonLabel(reason)).join(', ')}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">
                {viewReport?.type === 'topic' ? 'Tópico denunciado' : 'Resposta denunciada'}
              </h4>
              <div className="rounded-md border p-4 whitespace-pre-wrap">
                {viewReport?.type === 'topic' ? (
                  <div>
                    <h5 className="font-bold">{viewReport?.title}</h5>
                    <p className="mt-2">{viewReport?.content}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Em resposta ao tópico: <strong>{viewReport?.title}</strong>
                    </p>
                    <p>{viewReport?.content}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {viewReport?.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600"
                    onClick={() => {
                      handleResolve(viewReport.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Resolver
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-600"
                    onClick={() => {
                      handleDismiss(viewReport.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Dispensar
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