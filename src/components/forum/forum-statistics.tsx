"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ForumStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas do Fórum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">120</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Tópicos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">842</div>
              <div className="text-sm text-green-800 dark:text-green-300">Respostas</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Estatísticas simplificadas (gráficos indisponíveis)
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 