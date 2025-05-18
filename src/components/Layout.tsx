
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NotificationSystem } from "@/components/NotificationSystem";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 animate-fade-in">
      <header className="border-b h-16 flex items-center justify-between px-6 md:px-10 bg-white/90 dark:bg-slate-800/90 shadow-sm backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-blue-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            {t("common.taskManager")}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationSystem />
          
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className={`p-6 md:p-10 max-w-7xl mx-auto ${isRTL ? 'rtl' : ''}`}>
        {children}
      </main>
      
      <footer className="py-6 px-6 md:px-10 border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {t("common.taskManager")} © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
