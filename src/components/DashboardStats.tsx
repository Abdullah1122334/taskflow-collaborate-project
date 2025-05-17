
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, Paperclip, UserPlus } from "lucide-react";
import { Task } from "./TaskCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardStatsProps {
  tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const { t } = useLanguage();
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
      title: t("stats.totalTasks"),
      value: totalTasks,
      icon: Check,
      description: `${completedTasks} ${t("stats.completedTasks")}`,
      color: "bg-blue-500 dark:bg-blue-600",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: t("stats.upcomingDeadlines"),
      value: upcomingDeadlines,
      icon: Calendar,
      description: t("stats.withinDays"),
      color: "bg-amber-500 dark:bg-amber-600",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    {
      title: t("stats.attachments"),
      value: tasks.reduce((sum, task) => sum + task.attachments, 0),
      icon: Paperclip,
      description: t("stats.fromAllTasks"),
      color: "bg-emerald-500 dark:bg-emerald-600",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
    {
      title: t("stats.collaborators"),
      value: totalCollaborators,
      icon: UserPlus,
      description: t("stats.inProjects"),
      color: "bg-purple-500 dark:bg-purple-600",
      textColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="animate-fade-in border-t-4 dark:border-t-4 transition-all hover:shadow-lg dark:bg-slate-800 dark:text-white" style={{ borderTopColor: stat.color.split(' ')[0] }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.color} p-2 rounded-full text-white`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
