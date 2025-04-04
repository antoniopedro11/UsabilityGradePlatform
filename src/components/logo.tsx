import React from "react";
import Link from "next/link";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
  showTagline?: boolean;
}

export function Logo({
  size = "md",
  variant = "default",
  showTagline = false,
}: LogoProps) {
  // Sizes configuration
  const sizes = {
    sm: {
      container: "h-8",
      icon: "h-6 w-6",
      text: "text-lg",
      tagline: "text-xs",
    },
    md: {
      container: "h-10",
      icon: "h-8 w-8",
      text: "text-xl",
      tagline: "text-sm",
    },
    lg: {
      container: "h-14",
      icon: "h-10 w-10",
      text: "text-2xl",
      tagline: "text-base",
    },
  };

  // Colors configuration
  const colors = {
    default: {
      text: "text-gray-900 dark:text-white",
      tagline: "text-gray-500 dark:text-gray-400",
    },
    white: {
      text: "text-white",
      tagline: "text-orange-200",
    },
  };

  return (
    <Link href="/" className="flex flex-col items-center">
      <div className={`flex items-center ${sizes[size].container}`}>
        <div className={`mr-2 ${sizes[size].icon}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${variant === "default" ? "text-orange-500 dark:text-orange-400" : "text-orange-500"}`}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 9.05v-.1" />
            <path d="M16 9.05v-.1" />
            <path d="M16 14a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className={`font-bold ${sizes[size].text} ${colors[variant].text}`}>
          UsabilityGrade Platform
        </div>
      </div>
      {showTagline && (
        <div className={`${sizes[size].tagline} ${colors[variant].tagline} mt-1`}>
          Plataforma de Avaliação de Usabilidade
        </div>
      )}
    </Link>
  );
} 