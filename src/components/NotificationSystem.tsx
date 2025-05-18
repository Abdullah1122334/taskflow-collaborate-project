
import { useState, useEffect } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
};

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { t, language } = useLanguage();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convert strings back to Date objects
        const notificationsWithDates = parsedNotifications.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error("Error parsing notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    );
    setNotifications(updatedNotifications);
  };

  const removeNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const addNotification = (title: string, message: string) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      title,
      message,
      read: false,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also display as toast
    toast({
      title: title,
      description: message,
    });
    
    return newNotification.id;
  };

  // Expose the addNotification method globally
  useEffect(() => {
    (window as any).addNotification = addNotification;
    
    return () => {
      delete (window as any).addNotification;
    };
  }, []);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 rounded-full"
            aria-label={t("common.notifications")}
          >
            {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            {unreadCount > 0 && (
              <Badge 
                className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align={language === "ar" ? "end" : "start"}>
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium text-sm">{t("common.notifications")}</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                {language === 'ar' ? 'قراءة الكل' : 'Mark all read'}
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 ${notification.read ? '' : 'bg-primary/5'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground opacity-75">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}

// Export the notification type
export { addNotification };

// Helper function to add a notification from anywhere
export function addNotification(title: string, message: string): string | undefined {
  if (typeof window !== 'undefined' && (window as any).addNotification) {
    return (window as any).addNotification(title, message);
  }
  return undefined;
}
