
import { Calendar, Check, ChartGantt, Kanban, MessageSquare, Paperclip, UserPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

export function AppSidebar() {
  const { t, language } = useLanguage();
  
  // Menu items
  const mainMenuItems = [
    {
      title: t("sidebar.tasks"),
      icon: Check,
      url: "#",
    },
    {
      title: t("sidebar.deadlines"),
      icon: Calendar,
      url: "#",
    },
    {
      title: t("sidebar.notes"),
      icon: Paperclip,
      url: "#",
    },
  ];

  const collaborationItems = [
    {
      title: t("sidebar.collaborators"),
      icon: UserPlus,
      url: "#",
    },
    {
      title: t("sidebar.discussions"),
      icon: MessageSquare, 
      url: "#",
    },
  ];

  const viewItems = [
    {
      title: t("tabs.kanban"),
      icon: Kanban,
      url: "#",
    },
    {
      title: t("tabs.gantt"),
      icon: ChartGantt,
      url: "#",
    },
  ];

  const isRTL = language === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";
  const sidebarMenuButtonClass = isRTL ? "flex-row-reverse justify-end" : "";
  const marginClass = isRTL ? "mr-4 ml-0" : "ml-4 mr-0";

  return (
    <Sidebar className="border-r dark:border-slate-700">
      <SidebarHeader className="px-4 h-16 flex items-center border-b dark:border-slate-700">
        <div className="font-bold text-lg flex items-center">
          <span className="bg-primary text-white p-1 rounded mr-2">TM</span>
          {t("common.taskManager")}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={textAlignClass}>{t("sidebar.mainMenu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={sidebarMenuButtonClass}>
                    <a href={item.url} className="flex items-center hover:bg-accent rounded-md transition-all p-2">
                      <item.icon className="h-5 w-5" />
                      <span className={marginClass}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={textAlignClass}>{t("sidebar.collaboration")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={sidebarMenuButtonClass}>
                    <a href={item.url} className="flex items-center hover:bg-accent rounded-md transition-all p-2">
                      <item.icon className="h-5 w-5" />
                      <span className={marginClass}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={textAlignClass}>{t("sidebar.views")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {viewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={sidebarMenuButtonClass}>
                    <a href={item.url} className="flex items-center hover:bg-accent rounded-md transition-all p-2">
                      <item.icon className="h-5 w-5" />
                      <span className={marginClass}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
