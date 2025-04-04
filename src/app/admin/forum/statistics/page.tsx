import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForumStatistics } from "@/components/forum/forum-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Estatísticas do Fórum",
  description: "Visualize métricas e análises sobre o uso do fórum"
};

export default function ForumStatisticsPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estatísticas do Fórum</h1>
        <p className="text-muted-foreground mt-2">
          Visualize métricas e análises sobre o uso do fórum ao longo do tempo
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="topics">Tópicos</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total de Tópicos" 
              value="126" 
              description="Total de tópicos criados"
              trend="10%"
              trendUp={true} 
            />
            <MetricCard 
              title="Total de Respostas" 
              value="1,284" 
              description="Total de respostas em tópicos"
              trend="15%"
              trendUp={true} 
            />
            <MetricCard 
              title="Usuários Ativos" 
              value="243" 
              description="Usuários ativos no último mês"
              trend="5%"
              trendUp={true} 
            />
            <MetricCard 
              title="Visualizações" 
              value="8,472" 
              description="Visualizações totais este mês"
              trend="8%"
              trendUp={true} 
            />
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade do Fórum</CardTitle>
                <CardDescription>
                  Visualize a atividade do fórum ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ForumStatistics />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Usuários</CardTitle>
              <CardDescription>
                Informações detalhadas sobre os usuários do fórum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <MetricCard 
                    title="Novos Usuários" 
                    value="32" 
                    description="Novos este mês"
                    trend="12%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Taxa de Retenção" 
                    value="68%" 
                    description="Usuários que retornam"
                    trend="3%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Usuários Premium" 
                    value="54" 
                    description="Com assinatura premium"
                    trend="7%"
                    trendUp={true} 
                  />
                </div>
                
                <div className="h-[300px] w-full mt-6">
                  <p className="text-center text-muted-foreground py-20">
                    Gráfico detalhado de atividade de usuários (em desenvolvimento)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Tópicos</CardTitle>
              <CardDescription>
                Análise dos tópicos do fórum, categorias e interações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <MetricCard 
                    title="Tópicos Recentes" 
                    value="24" 
                    description="Criados este mês"
                    trend="15%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Média de Respostas" 
                    value="9.4" 
                    description="Respostas por tópico"
                    trend="2%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Taxa de Resolução" 
                    value="72%" 
                    description="Tópicos marcados resolvidos"
                    trend="5%"
                    trendUp={true} 
                  />
                </div>
                
                <div className="h-[300px] w-full mt-6">
                  <p className="text-center text-muted-foreground py-20">
                    Distribuição de tópicos por categoria (em desenvolvimento)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Engajamento</CardTitle>
              <CardDescription>
                Métricas de engajamento e participação dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <MetricCard 
                    title="Tempo Médio" 
                    value="8:24" 
                    description="Minutos por sessão"
                    trend="10%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Taxa de Conversão" 
                    value="4.7%" 
                    description="Visitantes para membros"
                    trend="1.2%"
                    trendUp={true} 
                  />
                  <MetricCard 
                    title="Participação" 
                    value="32%" 
                    description="Membros ativos semanais"
                    trend="8%"
                    trendUp={true} 
                  />
                </div>
                
                <div className="h-[300px] w-full mt-6">
                  <p className="text-center text-muted-foreground py-20">
                    Gráfico de engajamento por horário do dia (em desenvolvimento)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendUp 
}: { 
  title: string, 
  value: string, 
  description: string, 
  trend: string, 
  trendUp: boolean 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`mt-2 flex items-center text-xs ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          <span>{trendUp ? '↑' : '↓'}</span>
          <span className="ml-1">{trend} em relação ao mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
} 