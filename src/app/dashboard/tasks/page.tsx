"use client";

import { Card } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Acompanhe e gerencie suas tarefas de avaliação
        </p>
      </div>

      <Card className="p-6 text-center">
        <div className="py-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Página em Construção
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            A funcionalidade de tarefas está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </Card>
    </div>
  );
} 