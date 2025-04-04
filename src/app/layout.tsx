import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorSuppressor from "@/components/error-suppressor";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import ClientLayout from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Plataforma de Avaliação de Usabilidade",
  description: "Avalie e melhore a experiência dos seus utilizadores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen font-sans antialiased bg-gray-50 dark:bg-gray-900", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientLayout>
            {children}
          </ClientLayout>
          <ErrorSuppressor />
        </ThemeProvider>
      </body>
    </html>
  );
}
