"use client";

import { useState, useEffect } from "react";
import { Bell, X, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Schedule, ScheduleStatus } from "@/types/schedule";

interface ReminderNotification {
  id: string;
  schedule: Schedule;
  type: "reminder" | "overdue" | "upcoming";
  message: string;
  timestamp: Date;
}

interface ReminderSystemProps {
  schedules: Schedule[];
  onTaskClick?: (task: Schedule) => void;
}

export default function ReminderSystem({
  schedules,
  onTaskClick,
}: ReminderSystemProps) {
  const [notifications, setNotifications] = useState<ReminderNotification[]>(
    []
  );
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    checkForReminders();

    // Verificar lembretes a cada minuto
    const interval = setInterval(checkForReminders, 60000);

    return () => clearInterval(interval);
  }, [schedules]);

  const checkForReminders = () => {
    const now = new Date();
    const newNotifications: ReminderNotification[] = [];

    schedules.forEach((schedule) => {
      // Pular tasks já concluídas ou canceladas
      if (
        schedule.status === ScheduleStatus.COMPLETED ||
        schedule.status === ScheduleStatus.CANCELLED
      ) {
        return;
      }

      const scheduleDate = new Date(schedule.date);
      const timeDiff = scheduleDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Task atrasada
      // Corrigido: checar se a task está atrasada e não está concluída nem cancelada
      if (
        timeDiff < 0 &&
        (schedule.status === ScheduleStatus.PENDING ||
          schedule.status === ScheduleStatus.IN_PROGRESS ||
          schedule.status === ScheduleStatus.POSTPONED)
      ) {
        newNotifications.push({
          id: `overdue-${schedule.id}-${Date.now()}`,
          schedule,
          type: "overdue",
          message: `Task "${schedule.title}" está atrasada!`,
          timestamp: now,
        });
      }
      // Task hoje
      else if (daysDiff === 0) {
        newNotifications.push({
          id: `today-${schedule.id}-${Date.now()}`,
          schedule,
          type: "upcoming",
          message: `Task "${schedule.title}" é hoje!`,
          timestamp: now,
        });
      }
      // Task amanhã
      else if (daysDiff === 1) {
        newNotifications.push({
          id: `tomorrow-${schedule.id}-${Date.now()}`,
          schedule,
          type: "upcoming",
          message: `Task "${schedule.title}" é amanhã`,
          timestamp: now,
        });
      }
      // Lembretes configurados
      else if (schedule.reminders && schedule.reminders.length > 0) {
        schedule.reminders.forEach((reminder) => {
          const reminderTime = new Date(
            scheduleDate.getTime() - reminder.minutes * 60 * 1000
          );
          const reminderDiff = reminderTime.getTime() - now.getTime();

          // Lembrete deve ser disparado agora (dentro de 1 minuto)
          if (reminderDiff >= 0 && reminderDiff <= 60000) {
            newNotifications.push({
              id: `reminder-${schedule.id}-${reminder.minutes}-${Date.now()}`,
              schedule,
              type: "reminder",
              message: `Lembrete: "${schedule.title}" em ${reminder.minutes} minutos`,
              timestamp: now,
            });
          }
        });
      }
    });

    // Filtrar notificações duplicadas ou já existentes
    const existingIds = new Set(notifications.map((n) => n.id));
    const uniqueNewNotifications = newNotifications.filter(
      (n) => !existingIds.has(n.id)
    );

    if (uniqueNewNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...uniqueNewNotifications]);

      // Mostrar automaticamente se há novas notificações
      if (uniqueNewNotifications.length > 0) {
        setShowNotifications(true);
      }
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: ReminderNotification["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: ReminderNotification["type"]) => {
    switch (type) {
      case "overdue":
        return "bg-red-50 border-red-200 text-red-800";
      case "upcoming":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "reminder":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">
              Notificações {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={dismissAllNotifications}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Limpar todas
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma notificação</p>
                <p className="text-xs text-gray-400">Você está em dia!</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:shadow-md ${getNotificationColor(
                      notification.type
                    )}`}
                    onClick={() => {
                      onTaskClick?.(notification.schedule);
                      dismissNotification(notification.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs opacity-75 mt-1">
                            {notification.timestamp.toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Clique em uma notificação para ver detalhes da task
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
