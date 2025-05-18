
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Task } from "@/components/TaskCard";
import { DashboardStats } from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, ChartGantt } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { GanttChart } from "@/components/GanttChart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { toast } from "@/hooks/use-toast";
import { addNotification } from "@/components/NotificationSystem";

// Empty initial state - no predefined tasks
const initialTasks: Task[] = [];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Load tasks from local storage or use empty initial array
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
    
    // Send notification for task update
    addNotification(
      language === 'ar' ? 'تم تحديث المهمة' : 'Task Updated',
      language === 'ar' 
        ? `تم تحديث المهمة "${updatedTask.title}" بنجاح` 
        : `Task "${updatedTask.title}" was updated successfully`
    );
  };

  const handleTaskCreate = (newTask: Omit<Task, "id">) => {
    const task = {
      ...newTask,
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
    };
    setTasks([...tasks, task]);
    
    // Send notification for new task
    addNotification(
      language === 'ar' ? 'تمت إضافة مهمة جديدة' : 'New Task Added',
      language === 'ar' 
        ? `تمت إضافة المهمة "${task.title}" بنجاح` 
        : `Task "${task.title}" was added successfully`
    );
  };

  const handleTaskDelete = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter((task) => task.id !== id));
    
    if (taskToDelete) {
      // Send notification for task deletion
      addNotification(
        language === 'ar' ? 'تم حذف المهمة' : 'Task Deleted',
        language === 'ar' 
          ? `تم حذف المهمة "${taskToDelete.title}" بنجاح` 
          : `Task "${taskToDelete.title}" was deleted successfully`
      );
    }
  };

  const handleTaskStatusChange = (id: string, status: "todo" | "inProgress" | "done") => {
    const taskToUpdate = tasks.find(task => task.id === id);
    
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
    
    if (taskToUpdate) {
      const statusMessages = {
        todo: language === 'ar' ? 'قيد الانتظار' : 'Todo',
        inProgress: language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
        done: language === 'ar' ? 'مكتمل' : 'Done'
      };
      
      // Send notification for status change
      addNotification(
        language === 'ar' ? 'تم تغيير حالة المهمة' : 'Task Status Changed',
        language === 'ar' 
          ? `تم تغيير حالة المهمة "${taskToUpdate.title}" إلى ${statusMessages[status]}` 
          : `Task "${taskToUpdate.title}" status changed to ${statusMessages[status]}`
      );
    }
  };

  const handleQuickTaskCreate = (task: Omit<Task, "id">) => {
    handleTaskCreate(task);
    setIsAddDialogOpen(false);
  };

  const textAlignClass = language === "ar" ? "text-right" : "text-left";
  const isEmptyState = tasks.length === 0;

  return (
    <Layout>
      <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/5 shadow-sm border dark:from-primary/5 dark:to-accent/5">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {t("common.dashboard")}
          </h1>
          <p className={`text-muted-foreground ${textAlignClass}`}>
            {t("common.welcome")}
          </p>
        </CardContent>
      </Card>

      {!isEmptyState && <DashboardStats tasks={tasks} />}

      <Tabs defaultValue="kanban" className="mb-8 mt-10">
        <TabsList className="w-full md:w-auto bg-background border dark:border-slate-700 p-1 mb-4 rounded-lg shadow-sm">
          <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Kanban className="h-4 w-4" />
            <span>{t("tabs.kanban")}</span>
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ChartGantt className="h-4 w-4" />
            <span>{t("tabs.gantt")}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban" className="mt-6 animate-fade-in">
          {isEmptyState ? (
            <EmptyState onCreateTask={() => setIsAddDialogOpen(true)} />
          ) : (
            <KanbanBoard
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
              onTaskDelete={handleTaskDelete}
              onStatusChange={handleTaskStatusChange}
            />
          )}
        </TabsContent>
        
        <TabsContent value="gantt" className="mt-6">
          {isEmptyState ? (
            <EmptyState onCreateTask={() => setIsAddDialogOpen(true)} />
          ) : (
            <GanttChart tasks={tasks} />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quick Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'إضافة مهمة جديدة' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleQuickTaskCreate} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Empty state component
function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  const { language } = useLanguage();
  
  return (
    <Card className="w-full h-80 border border-dashed flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <Kanban className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {language === 'ar' ? 'لا توجد مهام بعد' : 'No Tasks Yet'}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {language === 'ar' 
            ? 'أضف مهامك الأولى للبدء في تنظيم وإدارة مشاريعك'
            : 'Add your first task to start organizing and managing your projects'
          }
        </p>
      </div>
      <Button onClick={onCreateTask} size="lg">
        {language === 'ar' ? 'إضافة مهمة جديدة' : 'Add Your First Task'}
      </Button>
    </Card>
  );
}

export default Index;
