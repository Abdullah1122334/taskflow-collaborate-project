
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Paperclip, Edit, Trash2, PriorityHigh, PriorityLow } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { arSA } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  attachments: number;
  collaborators: number;
  status: "todo" | "inProgress" | "done";
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "todo" | "inProgress" | "done") => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { toast } = useToast();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "priority-low";
      case "medium":
        return "priority-medium";
      case "high":
        return "priority-high";
      default:
        return "";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "low":
        return <PriorityLow className="h-4 w-4 text-green-600" />;
      case "high":
        return <PriorityHigh className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: "todo" | "inProgress" | "done") => {
    onStatusChange(task.id, newStatus);
    toast({
      title: "تم تحديث حالة المهمة",
      description: `تم تغيير حالة "${task.title}" إلى ${
        newStatus === "todo" ? "قيد الانتظار" : newStatus === "inProgress" ? "قيد التنفيذ" : "مكتمل"
      }`,
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "قيد الانتظار";
      case "inProgress":
        return "قيد التنفيذ";
      case "done":
        return "مكتمل";
      default:
        return status;
    }
  };

  const getTimeRemaining = () => {
    try {
      const timeRemaining = formatDistance(new Date(task.dueDate), new Date(), { 
        addSuffix: true,
        locale: arSA 
      });
      return timeRemaining;
    } catch (error) {
      return "غير معروف";
    }
  };

  return (
    <>
      <Card className="task-card">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{task.title}</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500" 
              onClick={() => {
                onDelete(task.id);
                toast({
                  title: "تم حذف المهمة",
                  description: `تم حذف "${task.title}" بنجاح`,
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className={`priority-badge ${getPriorityClass(task.priority)} flex items-center gap-1`}>
            {getPriorityIcon(task.priority)}
            {task.priority === "low" ? "منخفضة" : task.priority === "medium" ? "متوسطة" : "عالية"}
          </span>

          {task.attachments > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {task.attachments}
            </Badge>
          )}

          <Badge variant="secondary" className="cursor-pointer" onClick={() => setIsDetailOpen(true)}>
            {getStatusLabel(task.status)}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{getTimeRemaining()}</span>
          </div>
          {task.collaborators > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {[...Array(Math.min(task.collaborators, 3))].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white border-2 border-background"
                  >
                    م{i+1}
                  </div>
                ))}
              </div>
              {task.collaborators > 3 && <span>+{task.collaborators - 3}</span>}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تغيير حالة المهمة</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant={task.status === "todo" ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                handleStatusChange("todo");
                setIsDetailOpen(false);
              }}
            >
              قيد الانتظار
            </Button>
            <Button
              variant={task.status === "inProgress" ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                handleStatusChange("inProgress");
                setIsDetailOpen(false);
              }}
            >
              قيد التنفيذ
            </Button>
            <Button
              variant={task.status === "done" ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                handleStatusChange("done");
                setIsDetailOpen(false);
              }}
            >
              مكتمل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
