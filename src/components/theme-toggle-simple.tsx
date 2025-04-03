"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggleSimple() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Verificar o tema atual quando o componente é montado
  useEffect(() => {
    setMounted(true);
    // Verificar se o modo escuro está ativo
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
    console.log("Initial theme:", isDark ? "dark" : "light");
  }, []);

  // Alternar entre os temas
  const toggleTheme = () => {
    // Inverter o estado atual
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    // Aplicar o tema ao documento HTML
    if (newIsDarkMode) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {
        console.error("Failed to set theme in localStorage", e);
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {
        console.error("Failed to set theme in localStorage", e);
      }
    }

    // Logging para depuração
    console.log("Theme toggled:", newIsDarkMode ? "dark" : "light");
    console.log("HTML class:", document.documentElement.classList.contains("dark") ? "dark" : "light");
  };

  // Não renderizar nada durante a renderização do servidor
  if (!mounted) {
    return null;
  }

  // Renderizar o botão com o ícone correto
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Alternar tema"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600" />
      )}
    </Button>
  );
} 