
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Task } from "@/components/TaskCard";
import { DashboardStats } from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, ChartGantt } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample initial tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "تطوير واجهة المستخدم الرئيسية",
    description: "تصميم وتطوير صفحة الويب الرئيسية لمشروع إدارة المهام",
    priority: "high",
    dueDate: new Date(2025, 5, 20),
    attachments: 2,
    collaborators: 3,
    status: "inProgress",
  },
  {
    id: "2",
    title: "إعداد قاعدة البيانات",
    description: "تحضير هيكل قاعدة البيانات وإعداد النماذج الأولية",
    priority: "medium",
    dueDate: new Date(2025, 5, 25),
    attachments: 1,
    collaborators: 2,
    status: "todo",
  },
  {
    id: "3",
    title: "اختبار وظائف التسجيل",
    description: "إجراء اختبارات شاملة لعمليات تسجيل الدخول والتسجيل الجديد",
    priority: "low",
    dueDate: new Date(2025, 5, 18),
    attachments: 0,
    collaborators: 1,
    status: "done",
  },
  {
    id: "4",
    title: "تحسين أداء التطبيق",
    description: "تحليل وتحسين أداء التطبيق لتقليل وقت التحميل وزيادة سرعة الاستجابة",
    priority: "medium",
    dueDate: new Date(2025, 5, 30),
    attachments: 3,
    collaborators: 2,
    status: "todo",
  },
  {
    id: "5",
    title: "إصلاح أخطاء متعلقة بالواجهة",
    description: "معالجة مشكلات في واجهة المستخدم على الأجهزة المحمولة",
    priority: "high",
    dueDate: new Date(2025, 5, 19),
    attachments: 1,
    collaborators: 1,
    status: "inProgress",
  },
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Load tasks from local storage or use initial data
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskCreate = (newTask: Omit<Task, "id">) => {
    const task = {
      ...newTask,
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
    };
    setTasks([...tasks, task]);
  };

  const handleTaskDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskStatusChange = (id: string, status: "todo" | "inProgress" | "done") => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">{t("common.dashboard")}</h1>
        <p className="text-muted-foreground">
          {t("common.welcome")}
        </p>
      </div>

      <DashboardStats tasks={tasks} />

      <Tabs defaultValue="kanban" className="mb-8">
        <TabsList className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Kanban className="h-4 w-4" />
            <span>{t("tabs.kanban")}</span>
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <ChartGantt className="h-4 w-4" />
            <span>{t("tabs.gantt")}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        </TabsContent>
        <TabsContent value="gantt" className="mt-6">
          <div className="flex items-center justify-center h-48 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700">
            <p className="text-muted-foreground">{t("common.comingSoon")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
