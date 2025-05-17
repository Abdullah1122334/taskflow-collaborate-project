
import { useState } from "react";
import { Task, TaskCard } from "./TaskCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskCreate: (task: Omit<Task, "id">) => void;
  onTaskDelete: (id: string) => void;
  onStatusChange: (id: string, status: "todo" | "inProgress" | "done") => void;
}

export function KanbanBoard({ tasks, onTaskUpdate, onTaskCreate, onTaskDelete, onStatusChange }: KanbanBoardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskUpdate = (updatedTaskData: Omit<Task, "id">) => {
    if (editingTask) {
      const updatedTask = { ...updatedTaskData, id: editingTask.id };
      onTaskUpdate(updatedTask as Task);
      setEditingTask(undefined);
      toast({
        title: "تم تحديث المهمة",
        description: `تم تحديث "${updatedTask.title}" بنجاح`,
      });
    }
  };

  const handleTaskCreate = (newTask: Omit<Task, "id">) => {
    onTaskCreate(newTask);
    setIsAddDialogOpen(false);
    toast({
      title: "تم إنشاء المهمة",
      description: `تم إنشاء "${newTask.title}" بنجاح`,
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> مهمة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
              قيد الانتظار
            </h2>
            <span className="bg-secondary px-2 py-1 rounded-full text-xs">
              {todoTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {todoTasks.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm p-4">لا توجد مهام في قائمة الانتظار</p>
            ) : (
              todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onTaskDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              قيد التنفيذ
            </h2>
            <span className="bg-secondary px-2 py-1 rounded-full text-xs">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm p-4">لا توجد مهام قيد التنفيذ</p>
            ) : (
              inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onTaskDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              مكتمل
            </h2>
            <span className="bg-secondary px-2 py-1 rounded-full text-xs">
              {doneTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {doneTasks.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm p-4">لا توجد مهام مكتملة</p>
            ) : (
              doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onTaskDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>إضافة مهمة جديدة</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleTaskCreate} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(undefined)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>تعديل المهمة</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              editTask={editingTask} 
              onSubmit={handleTaskUpdate} 
              onCancel={() => setEditingTask(undefined)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
