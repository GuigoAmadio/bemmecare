"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  Play,
} from "lucide-react";
import { Schedule, ScheduleStatus } from "@/types/schedule";
import ViewModeSelector from "./ViewModeSelector";

interface WeeklyViewProps {
  schedules: Schedule[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCreateTask: (date: Date) => void;
  onTaskClick: (task: Schedule) => void;
  viewMode: "calendar" | "weekly" | "list";
  onViewModeChange: (mode: "calendar" | "weekly" | "list") => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function WeeklyView({
  schedules,
  selectedDate,
  onDateChange,
  onCreateTask,
  onTaskClick,
  viewMode,
  onViewModeChange,
  searchValue = "",
  onSearchChange,
}: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  // Calcular início e fim da semana
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentWeek]);

  // Navegar semanas
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(today);
    onDateChange(today);
  };

  // Obter schedules para um dia específico
  const getSchedulesForDay = (date: Date) => {
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  // Obter schedules para um horário específico
  const getSchedulesForHour = (date: Date, hour: number) => {
    const daySchedules = getSchedulesForDay(date);

    return daySchedules.filter((schedule) => {
      if (schedule.allDay) return hour === 0; // Mostrar tasks de dia inteiro na primeira hora

      if (!schedule.startTime) return false;

      const startHour = new Date(schedule.startTime).getHours();
      const endHour = schedule.endTime
        ? new Date(schedule.endTime).getHours()
        : startHour;

      return hour >= startHour && hour <= endHour;
    });
  };

  // Verificar se é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar se é a data selecionada
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Formatação de período da semana
  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString(
        "pt-BR",
        { month: "long", year: "numeric" }
      )}`;
    } else {
      return `${start.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
      })} - ${end.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED:
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case ScheduleStatus.IN_PROGRESS:
        return <Play className="h-3 w-3 text-blue-600" />;
      case ScheduleStatus.PENDING:
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case ScheduleStatus.CANCELLED:
        return <XCircle className="h-3 w-3 text-red-600" />;
      case ScheduleStatus.POSTPONED:
        return <Pause className="h-3 w-3 text-orange-600" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTaskColor = (schedule: Schedule) => {
    if (schedule.allDay) {
      return "bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800";
    }

    switch (schedule.status) {
      case ScheduleStatus.COMPLETED:
        return "bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800";
      case ScheduleStatus.IN_PROGRESS:
        return "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800";
      case ScheduleStatus.CANCELLED:
        return "bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800";
      case ScheduleStatus.POSTPONED:
        return "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300 text-orange-800";
      default:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800";
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="p-3 bg-black rounded-full transition-all duration-300 hover:cursor-pointer hover:scale-120"
        >
          <ChevronLeft className="hover:text-purple-200 h-8 w-8 text-gray-600" />
        </button>
        <button
          onClick={goToNextWeek}
          className="p-3 rounded-full transition-all duration-300 hover:cursor-pointer hover:scale-120"
        >
          <ChevronRight className="hover:text-purple-200 h-8 w-8 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">Vista Semanal</h2>
          <span className="text-gray-600">{formatWeekRange()}</span>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* ViewModeSelector */}
        <ViewModeSelector
          currentView={viewMode}
          onViewChange={onViewModeChange}
          showSearch={true}
          searchValue={searchValue || ""}
          onSearchChange={onSearchChange}
        />
      </div>

      {/* Calendar Grid */}
      <div className="overflow-auto h-full">
        <div className="">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
            <div className="p-3 text-center font-medium text-gray-700 border-r border-gray-200">
              Horário
            </div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`p-3 text-center border-r border-gray-200 cursor-pointer transition-colors ${
                  isToday(day)
                    ? "bg-blue-100 text-blue-900 font-bold"
                    : isSelected(day)
                    ? "bg-purple-100 text-purple-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onDateChange(day)}
              >
                <div className="font-medium">{DAYS_OF_WEEK[index]}</div>
                <div className="text-lg">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Hours Grid */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]"
            >
              {/* Hour Label */}
              <div className="p-2 text-center text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                {hour.toString().padStart(2, "0")}:00
              </div>

              {/* Day Cells */}
              {weekDays.map((day, dayIndex) => {
                const hourSchedules = getSchedulesForHour(day, hour);

                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className="border-r border-gray-200 p-1 relative group hover:bg-gray-50 transition-colors"
                  >
                    {/* Add Task Button */}
                    <button
                      onClick={() => onCreateTask(day)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all z-10"
                      title="Criar Task"
                    >
                      <Plus className="h-3 w-3" />
                    </button>

                    {/* Tasks */}
                    <div className="space-y-1">
                      {hourSchedules.map((schedule, taskIndex) => (
                        <div
                          key={taskIndex}
                          onClick={() => onTaskClick(schedule)}
                          className={`p-1 rounded border text-xs cursor-pointer hover:shadow-md transition-all ${getTaskColor(
                            schedule
                          )}`}
                          title={schedule.description || schedule.title}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(schedule.status)}
                            <span className="truncate font-medium">
                              {schedule.title}
                            </span>
                          </div>

                          {!schedule.allDay && schedule.startTime && (
                            <div className="text-xs opacity-75 mt-1">
                              {new Date(schedule.startTime).toLocaleTimeString(
                                "pt-BR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                              {schedule.endTime &&
                                ` - ${new Date(
                                  schedule.endTime
                                ).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`}
                            </div>
                          )}

                          {schedule.allDay && (
                            <div className="text-xs opacity-75 mt-1">
                              Dia inteiro
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer com estatísticas da semana */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              <strong>
                {
                  schedules.filter((s) => {
                    const scheduleDate = new Date(s.date);
                    return weekDays.some(
                      (day) =>
                        day.toDateString() === scheduleDate.toDateString()
                    );
                  }).length
                }
              </strong>{" "}
              tasks esta semana
            </span>
            <span>
              <strong>
                {
                  schedules.filter((s) => {
                    const scheduleDate = new Date(s.date);
                    return (
                      weekDays.some(
                        (day) =>
                          day.toDateString() === scheduleDate.toDateString()
                      ) && s.status === ScheduleStatus.COMPLETED
                    );
                  }).length
                }
              </strong>{" "}
              concluídas
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Clique em uma célula para criar task • Clique em uma task para ver
            detalhes
          </div>
        </div>
      </div>
    </div>
  );
}
