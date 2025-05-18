
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/components/TaskCard";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Rectangle,
  Legend,
} from "recharts";

interface GanttChartProps {
  tasks: Task[];
}

export function GanttChart({ tasks }: GanttChartProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const chartRef = useRef<HTMLDivElement>(null);

  // Prepare data for Gantt chart
  const chartData = tasks.map(task => {
    // Calculate task duration (in days)
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - Math.floor(Math.random() * 5))); // Mock start date
    const endDate = new Date(task.dueDate);
    const duration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
    
    // Calculate position on timeline
    const now = new Date();
    const daysFromNow = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    return {
      name: task.title,
      start: startDate,
      end: endDate,
      duration: duration,
      daysFromNow: daysFromNow,
      status: task.status,
      priority: task.priority,
      id: task.id,
    };
  });

  // Sort by due date
  const sortedData = [...chartData].sort((a, b) => a.end.getTime() - b.end.getTime());

  // Create array of dates for x-axis (14 day period)
  const dateArray = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  // Generate task bars for the chart
  const ganttData = sortedData.map((task, index) => {
    const result: Record<string, any> = { name: task.name };
    
    dateArray.forEach((date, dateIndex) => {
      const formattedDate = formatDate(date);
      const isActiveDate = (
        task.start <= date && date <= task.end
      );
      
      result[formattedDate] = isActiveDate ? 1 : 0;
      result[`${formattedDate}-active`] = isActiveDate;
      result[`${formattedDate}-status`] = isActiveDate ? task.status : null;
      result[`${formattedDate}-priority`] = isActiveDate ? task.priority : null;
    });
    
    return result;
  });

  // Get color based on priority and status
  const getBarColor = (status: string, priority: string) => {
    if (status === 'done') return '#22c55e';
    if (status === 'inProgress') return '#3b82f6';
    
    // For todo tasks, color based on priority
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#a8a29e';
      default: return '#a8a29e';
    }
  };
  
  // Custom bar component
  const CustomBar = (props: any) => {
    const { x, y, width, height, status, priority } = props;
    const color = getBarColor(status, priority);
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        radius={[3, 3, 3, 3]}
        className="transition-all duration-300 hover:opacity-80"
      />
    );
  };

  // Create formatter for Y axis to handle RTL
  const formatYAxisTick = (value: string) => {
    // Truncate long task names
    return value.length > 15 ? `${value.substring(0, 15)}...` : value;
  };

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="p-4">
        <div ref={chartRef} className="min-w-[1000px] h-[400px]">
          <ChartContainer 
            config={{
              todo: { color: '#a8a29e' },
              inProgress: { color: '#3b82f6' },
              done: { color: '#22c55e' },
              high: { color: '#ef4444' },
              medium: { color: '#f97316' },
              low: { color: '#a8a29e' },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={ganttData} 
                layout="vertical" 
                barGap={0}
                barSize={20}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <XAxis 
                  type="category" 
                  dataKey="name" 
                  hide 
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatYAxisTick}
                  mirror={isRTL}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const dateKey = payload[0].dataKey;
                      const baseDate = dateKey.split('-')[0];
                      const status = data[`${baseDate}-status`];
                      const priority = data[`${baseDate}-priority`];
                      
                      if (!status) return null;
                      
                      const statusText = {
                        todo: language === 'ar' ? 'قيد الانتظار' : 'Todo',
                        inProgress: language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
                        done: language === 'ar' ? 'مكتمل' : 'Done',
                      }[status] || '';
                      
                      const priorityText = {
                        high: language === 'ar' ? 'عالية' : 'High',
                        medium: language === 'ar' ? 'متوسطة' : 'Medium',
                        low: language === 'ar' ? 'منخفضة' : 'Low',
                      }[priority] || '';
                      
                      return (
                        <div className="p-2 bg-background border rounded-md shadow-lg text-sm">
                          <div className="font-bold">{label}</div>
                          <div>{baseDate}</div>
                          <div className="flex gap-2 items-center">
                            <div className="font-medium">
                              {language === 'ar' ? 'الحالة:' : 'Status:'} 
                            </div>
                            <div>{statusText}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="font-medium">
                              {language === 'ar' ? 'الأولوية:' : 'Priority:'}
                            </div> 
                            <div>{priorityText}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {dateArray.map((date, index) => {
                  const formattedDate = formatDate(date);
                  return (
                    <Bar
                      key={formattedDate}
                      dataKey={formattedDate}
                      name={formattedDate}
                      stackId="a"
                      shape={(props) => (
                        <CustomBar
                          {...props}
                          status={props.payload[`${formattedDate}-status`]}
                          priority={props.payload[`${formattedDate}-priority`]}
                        />
                      )}
                    />
                  );
                })}
                <Legend 
                  payload={[
                    { value: language === 'ar' ? 'قيد الانتظار' : 'Todo', type: 'rect', color: '#a8a29e' },
                    { value: language === 'ar' ? 'قيد التنفيذ' : 'In Progress', type: 'rect', color: '#3b82f6' },
                    { value: language === 'ar' ? 'مكتمل' : 'Done', type: 'rect', color: '#22c55e' },
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
