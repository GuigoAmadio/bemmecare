"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Notification } from "@/types";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Date.now().toString();
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      if (
        !notification.persistent &&
        newNotification.duration &&
        newNotification.duration > 0
      ) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback(
    (message: string, title = "Sucesso") => {
      addNotification({ type: "success", title, message });
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string, title = "Erro") => {
      addNotification({ type: "error", title, message, duration: 7000 });
    },
    [addNotification]
  );

  const warning = useCallback(
    (message: string, title = "Atenção") => {
      addNotification({ type: "warning", title, message, duration: 6000 });
    },
    [addNotification]
  );

  const info = useCallback(
    (message: string, title = "Informação") => {
      addNotification({ type: "info", title, message });
    },
    [addNotification]
  );

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
