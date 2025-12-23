import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      checkAndCreateNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
    }
  };

  const checkAndCreateNotifications = async () => {
    if (!user) return;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Check for due training
    const { data: upcomingDue } = await supabase
      .from("user_progress")
      .select(`
        module_id,
        due_date,
        training_modules (title)
      `)
      .eq("user_id", user.id)
      .eq("status", "in_progress")
      .gte("due_date", now.toISOString())
      .lte("due_date", sevenDaysFromNow.toISOString());

    // Check for expiring certificates
    const { data: expiringCerts } = await supabase
      .from("compliance_records")
      .select(`
        module_id,
        expiry_date,
        training_modules (title)
      `)
      .eq("user_id", user.id)
      .eq("is_valid", true)
      .gte("expiry_date", now.toISOString())
      .lte("expiry_date", thirtyDaysFromNow.toISOString());

    // Create notifications for due training (if not already notified today)
    if (upcomingDue?.length) {
      for (const item of upcomingDue) {
        const moduleTitle = (item.training_modules as any)?.title || "Training";
        const dueDate = new Date(item.due_date!).toLocaleDateString();
        
        // Check if notification already exists for today
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .like("title", `%${moduleTitle}%`)
          .gte("created_at", new Date().toISOString().split('T')[0]);

        if (!existing?.length) {
          await supabase.from("notifications").insert({
            user_id: user.id,
            title: `Training Due Soon`,
            message: `"${moduleTitle}" is due on ${dueDate}`,
            type: "warning",
            link: `/training/${item.module_id}`,
          });
        }
      }
    }

    // Create notifications for expiring certificates
    if (expiringCerts?.length) {
      for (const item of expiringCerts) {
        const moduleTitle = (item.training_modules as any)?.title || "Certificate";
        const expiryDate = new Date(item.expiry_date!).toLocaleDateString();
        
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .like("title", `%expiring%`)
          .like("message", `%${moduleTitle}%`)
          .gte("created_at", new Date().toISOString().split('T')[0]);

        if (!existing?.length) {
          await supabase.from("notifications").insert({
            user_id: user.id,
            title: `Certificate Expiring`,
            message: `"${moduleTitle}" expires on ${expiryDate}`,
            type: "error",
            link: `/training/${item.module_id}`,
          });
        }
      }
    }

    fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-destructive/10 border-destructive/20";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "success":
        return "bg-green-500/10 border-green-500/20";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-muted/50 transition-colors border-l-2",
                    getTypeColor(notification.type),
                    !notification.is_read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm truncate",
                        !notification.is_read && "font-medium"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
