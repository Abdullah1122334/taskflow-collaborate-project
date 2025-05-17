
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen flex w-full">
        <div className="md:block hidden">
          <AppSidebar />
        </div>
        
        {/* Mobile sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
            <div className="w-64 h-full bg-background animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <AppSidebar />
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <header className="border-b h-16 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <List />
              </Button>
              <h1 className="font-semibold text-xl">مدير المهام المتقدم</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell />
                <Badge className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0">3</Badge>
              </Button>
              <Button variant="outline" size="sm">اللغة العربية</Button>
            </div>
          </header>
          
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
