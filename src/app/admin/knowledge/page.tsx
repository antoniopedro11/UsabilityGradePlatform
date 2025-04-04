"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { KnowledgeArticlesList } from "@/components/knowledge/knowledge-articles-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeCategoriesList } from "@/components/knowledge/knowledge-categories-list";

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("articles");
  
  // Verifica se há um parâmetro tab na URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam === "categories") {
      setActiveTab("categories");
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <PageHeader className="pb-8">
        <PageHeaderHeading>Base de Conhecimento</PageHeaderHeading>
        <PageHeaderDescription>
          Gerencie artigos e categorias da base de conhecimento
        </PageHeaderDescription>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            {activeTab === "articles" && (
              <Button asChild>
                <Link href="/admin/knowledge/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Artigo
                </Link>
              </Button>
            )}
            {activeTab === "categories" && (
              <Button asChild>
                <Link href="/admin/knowledge/categories/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Categoria
                </Link>
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="articles" className="mt-4">
          <KnowledgeArticlesList />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <KnowledgeCategoriesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}