
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, Paperclip, UserPlus } from "lucide-react";
import { Task } from "./TaskCard";

interface DashboardStatsProps {
  tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "done").length;
  const upcomingDeadlines = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    return dueDate <= threeDaysLater && dueDate >= today && task.status !== "done";
  }).length;

  const totalCollaborators = tasks.reduce((sum, task) => sum + task.collaborators, 0);

  const stats = [
    {
      title: "إجمالي المهام",
      value: totalTasks,
      icon: Check,
      description: `${completedTasks} مهمة مكتملة`,
    },
    {
      title: "مواعيد قريبة",
      value: upcomingDeadlines,
      icon: Calendar,
      description: "خلال 3 أيام",
    },
    {
      title: "المرفقات",
      value: tasks.reduce((sum, task) => sum + task.attachments, 0),
      icon: Paperclip,
      description: "من جميع المهام",
    },
    {
      title: "المتعاونون",
      value: totalCollaborators,
      icon: UserPlus,
      description: "مشاركون في المشاريع",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
