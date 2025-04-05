"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState("pt");
  const [mounted, setMounted] = useState(false);

  // Evitar renderização no lado do servidor
  useEffect(() => {
    setMounted(true);
    // Verificar o idioma no localStorage se existir
    const savedLang = localStorage.getItem("language") || "pt";
    setCurrentLang(savedLang);
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
    // Aqui pode ser adicionada a lógica para alterar o idioma na aplicação
    // Por exemplo, se estiver usando i18n ou similar
    document.documentElement.lang = lang;
  };

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          aria-label="Alterar idioma"
        >
          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Alterar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage("pt")}
          className={currentLang === "pt" ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : ""}
        >
          <span className="mr-2">🇵🇹</span> Português
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={currentLang === "en" ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : ""}
        >
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 