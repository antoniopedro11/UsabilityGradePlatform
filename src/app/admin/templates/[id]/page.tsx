"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalhes do Modelo {templateId}</h1>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Esta página está em desenvolvimento.
        </p>
      </div>
    </div>
  );
} 