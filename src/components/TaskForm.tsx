
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();

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

  // Get translations
  const getFieldLabel = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      ar: {
        title: "عنوان المهمة",
        description: "وصف المهمة",
        priority: "الأولوية",
        dueDate: "تاريخ الاستحقاق",
        attachments: "عدد المرفقات",
        collaborators: "عدد المتعاونين",
        cancel: "إلغاء",
        update: "تحديث المهمة",
        add: "إضافة مهمة",
        low: "منخفضة",
        medium: "متوسطة",
        high: "عالية",
        selectDate: "حدد تاريخًا",
        selectPriority: "حدد الأولوية",
        titlePlaceholder: "أدخل عنوان المهمة",
        descriptionPlaceholder: "أدخل وصفًا للمهمة"
      },
      en: {
        title: "Task Title",
        description: "Task Description",
        priority: "Priority",
        dueDate: "Due Date",
        attachments: "Attachments",
        collaborators: "Collaborators",
        cancel: "Cancel",
        update: "Update Task",
        add: "Add Task",
        low: "Low",
        medium: "Medium",
        high: "High",
        selectDate: "Select date",
        selectPriority: "Select priority",
        titlePlaceholder: "Enter task title",
        descriptionPlaceholder: "Enter task description"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{getFieldLabel("title")}</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder={getFieldLabel("titlePlaceholder")}
          className="text-base"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">{getFieldLabel("description")}</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder={getFieldLabel("descriptionPlaceholder")}
          rows={3} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{getFieldLabel("priority")}</Label>
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder={getFieldLabel("selectPriority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{getFieldLabel("low")}</SelectItem>
              <SelectItem value="medium">{getFieldLabel("medium")}</SelectItem>
              <SelectItem value="high">{getFieldLabel("high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{getFieldLabel("dueDate")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: language === "ar" ? ar : undefined }) : getFieldLabel("selectDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                locale={language === "ar" ? ar : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attachments">{getFieldLabel("attachments")}</Label>
          <Input 
            id="attachments" 
            type="number" 
            value={attachments} 
            onChange={(e) => setAttachments(Number(e.target.value))} 
            min={0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="collaborators">{getFieldLabel("collaborators")}</Label>
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
          {getFieldLabel("cancel")}
        </Button>
        <Button type="submit">
          {editTask ? getFieldLabel("update") : getFieldLabel("add")}
        </Button>
      </div>
    </form>
  );
}
