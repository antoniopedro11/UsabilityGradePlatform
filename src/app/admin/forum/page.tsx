import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, PenSquare, Shield, BarChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Administração do Fórum",
  description: "Gerencie categorias, tópicos e respostas do fórum de discussão"
};

export default function AdminForumPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Administração do Fórum</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie categorias, tópicos e respostas do fórum de discussão
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card de Categorias */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Categorias
              </CardTitle>
              <CardDescription>
                Gerencie as categorias do fórum, criando, editando ou removendo conforme necessário.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Criar novas categorias de discussão</li>
                <li>• Editar categorias existentes</li>
                <li>• Gerenciar a organização do fórum</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/admin/forum/categories">
                  Gerenciar Categorias
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Card de Tópicos */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Tópicos
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os tópicos do fórum, destacando ou removendo conforme necessário.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Visualizar todos os tópicos</li>
                <li>• Marcar tópicos como fixados</li>
                <li>• Fechar ou remover tópicos</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/admin/forum/topics">
                  Gerenciar Tópicos
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Card de Moderação */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Moderação
              </CardTitle>
              <CardDescription>
                Modere o conteúdo do fórum, revisando e gerenciando tópicos e respostas dos usuários.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Revisar conteúdo reportado</li>
                <li>• Moderar tópicos e respostas</li>
                <li>• Manter a qualidade das discussões</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/admin/forum/moderation">
                  Área de Moderação
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Card de Configurações */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <PenSquare className="mr-2 h-5 w-5 text-primary" />
                Configurações
              </CardTitle>
              <CardDescription>
                Configure as regras e opções gerais do fórum de discussão.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Regras de postagem</li>
                <li>• Configurações de notificação</li>
                <li>• Opções de visualização</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/admin/forum/settings">
                  Configurar Fórum
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Card de Estatísticas */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Estatísticas
              </CardTitle>
              <CardDescription>
                Visualize métricas e análises do desempenho do fórum.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Atividade do fórum</li>
                <li>• Tópicos populares</li>
                <li>• Estatísticas de usuários</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/admin/forum/statistics">
                  Ver Estatísticas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 