"use client";

import { useState } from "react";
import { Schedule, ScheduleStatus } from "@/types/schedule";
import { Clock, CheckCircle, AlertTriangle, XCircle, Pause, Play } from "lucide-react";

interface DraggableTaskProps {
  schedule: Schedule;
  onDragStart?: (schedule: Schedule) => void;
  onDragEnd?: () => void;
  onClick?: (schedule: Schedule) => void;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
}

export default function DraggableTask({
  schedule,
  onDragStart,
  onDragEnd,
  onClick,
  size = "small",
  showDetails = false,
}: DraggableTaskProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getStatusIcon = (status: ScheduleStatus) => {
    const iconClass = size === "small" ? "h-3 w-3" : size === "medium" ? "h-4 w-4" : "h-5 w-5";
    
    switch (status) {
      case ScheduleStatus.COMPLETED:
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case ScheduleStatus.IN_PROGRESS:
        return <Play className={`${iconClass} text-blue-600`} />;
      case ScheduleStatus.PENDING:
        return <Clock className={`${iconClass} text-yellow-600`} />;
      case ScheduleStatus.CANCELLED:
        return <XCircle className={`${iconClass} text-red-600`} />;
      case ScheduleStatus.POSTPONED:
        return <Pause className={`${iconClass} text-orange-600`} />;
      default:
        return <Clock className={`${iconClass} text-gray-400`} />;
    }
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED:
        return "bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800";
      case ScheduleStatus.IN_PROGRESS:
        return "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800";
      case ScheduleStatus.CANCELLED:
        return "bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800";
      case ScheduleStatus.POSTPONED:
        return "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300 text-orange-800";
      case ScheduleStatus.PENDING:
      default:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "p-1 text-xs min-h-6";
      case "medium":
        return "p-2 text-sm min-h-8";
      case "large":
        return "p-3 text-base min-h-12";
      default:
        return "p-1 text-xs min-h-6";
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "schedule",
      data: schedule,
    }));
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(schedule);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(schedule);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`
        rounded border cursor-move transition-all duration-200
        ${getSizeClasses()}
        ${getStatusColor(schedule.status)}
        ${isDragging ? "opacity-50 scale-95" : "hover:shadow-md hover:scale-105"}
        ${onClick ? "cursor-pointer" : ""}
      `}
      title={showDetails ? undefined : `${schedule.title}${schedule.description ? ` - ${schedule.description}` : ''}`}
    >
      <div className="flex items-center space-x-1">
        {getStatusIcon(schedule.status)}
        <span className="truncate font-medium flex-1">
          {schedule.title}
        </span>
      </div>
      
      {showDetails && size !== "small" && (
        <>
          {schedule.description && (
            <p className="text-xs opacity-75 mt-1 truncate">
              {schedule.description}
            </p>
          )}
          
          {!schedule.allDay && schedule.startTime && (
            <div className="text-xs opacity-75 mt-1">
              {new Date(schedule.startTime).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {schedule.endTime && (
                ` - ${new Date(schedule.endTime).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}`
              )}
            </div>
          )}
          
          {schedule.allDay && (
            <div className="text-xs opacity-75 mt-1">
              Dia inteiro
            </div>
          )}
        </>
      )}
    </div>
  );
}
