
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "./TaskCard";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
  editTask?: Task;
  onCancel: () => void;
}

export function TaskForm({ onSubmit, editTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [attachments, setAttachments] = useState(0);
  const [collaborators, setCollaborators] = useState(0);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setDueDate(new Date(editTask.dueDate));
      setPriority(editTask.priority);
      setAttachments(editTask.attachments);
      setCollaborators(editTask.collaborators);
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const task = {
      title,
      description,
      dueDate: dueDate || new Date(),
      priority,
      attachments,
      collaborators,
      status: editTask?.status || "todo" as "todo" | "inProgress" | "done",
    };
    
    onSubmit(task);
    
    // Reset form if not editing
    if (!editTask) {
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setPriority("medium");
      setAttachments(0);
      setCollaborators(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان المهمة</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="أدخل عنوان المهمة" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">وصف المهمة</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="أدخل وصفًا للمهمة" 
          rows={3} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الأولوية</Label>
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="حدد الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>تاريخ الاستحقاق</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: ar }) : "حدد تاريخًا"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                locale={ar}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attachments">عدد المرفقات</Label>
          <Input 
            id="attachments" 
            type="number" 
            value={attachments} 
            onChange={(e) => setAttachments(Number(e.target.value))} 
            min={0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="collaborators">عدد المتعاونين</Label>
          <Input 
            id="collaborators" 
            type="number" 
            value={collaborators} 
            onChange={(e) => setCollaborators(Number(e.target.value))} 
            min={0}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">{editTask ? "تحديث المهمة" : "إضافة مهمة"}</Button>
      </div>
    </form>
  );
}
