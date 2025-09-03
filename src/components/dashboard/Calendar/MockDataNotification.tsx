"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, Database, Calendar } from "lucide-react";

interface MockDataNotificationProps {
  isActive: boolean;
  scheduleCount: number;
  onClose: () => void;
}

export default function MockDataNotification({
  isActive,
  scheduleCount,
  onClose,
}: MockDataNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive && scheduleCount > 0) {
      setIsVisible(true);
      // Auto-hide após 8 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, scheduleCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Database className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-medium text-gray-900">
                Dados Mockup Ativos
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {scheduleCount} schedules carregados no calendário. 
              Você pode visualizar e interagir com eles!
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Navegue pelo calendário para ver os dados</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
