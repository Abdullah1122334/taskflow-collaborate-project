
import { Calendar, Check, ChartGantt, Kanban, MessageSquare, PaperClip, UserPlus } from "lucide-react";
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

// Menu items
const mainMenuItems = [
  {
    title: "المهام",
    icon: Check,
    url: "#",
  },
  {
    title: "المواعيد النهائية",
    icon: Calendar,
    url: "#",
  },
  {
    title: "الملاحظات",
    icon: PaperClip,
    url: "#",
  },
];

const collaborationItems = [
  {
    title: "المتعاونون",
    icon: UserPlus,
    url: "#",
  },
  {
    title: "المناقشات",
    icon: MessageSquare, 
    url: "#",
  },
];

const viewItems = [
  {
    title: "لوحة كانبان",
    icon: Kanban,
    url: "#",
  },
  {
    title: "مخطط جانت",
    icon: ChartGantt,
    url: "#",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 h-16 flex items-center">
        <div className="font-bold text-lg flex items-center">
          <span className="bg-primary text-white p-1 rounded mr-2">TM</span>
          مدير المهام
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="sidebar-menu-button">
                    <a href={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      <span className="mr-4 ml-0">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>التعاون</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="sidebar-menu-button">
                    <a href={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      <span className="mr-4 ml-0">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>طريقة العرض</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {viewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="sidebar-menu-button">
                    <a href={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5" />
                      <span className="mr-4 ml-0">{item.title}</span>
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
