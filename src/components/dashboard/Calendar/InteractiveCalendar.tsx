"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Circle,
  Palette,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Schedule, ScheduleStatus, ScheduleCategory } from "@/types/schedule";
import DraggableTask from "./DraggableTask";
import DropZone from "./DropZone";
import ViewModeSelector from "./ViewModeSelector";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  schedules: Schedule[];
  customColor?: string;
}

interface InteractiveCalendarProps {
  schedules: Schedule[];
  onDayClick: (date: Date) => void;
  onCreateTask: (date: Date) => void;
  onTaskClick?: (task: Schedule) => void;
  onTaskMove?: (taskId: string, newDate: Date) => void;
  selectedDate?: Date;
  onViewModeChange?: (mode: "calendar" | "weekly" | "list") => void;
  viewMode?: "calendar" | "weekly" | "list";
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const CALENDAR_COLORS = [
  { name: "Padrão", value: "" },
  { name: "Azul Suave", value: "bg-blue-50 border-blue-200" },
  { name: "Verde Suave", value: "bg-emerald-50 border-emerald-200" },
  { name: "Roxo Suave", value: "bg-purple-50 border-purple-200" },
  { name: "Rosa Suave", value: "bg-pink-50 border-pink-200" },
  { name: "Laranja Suave", value: "bg-orange-50 border-orange-200" },
  { name: "Vermelho Suave", value: "bg-red-50 border-red-200" },
  { name: "Amarelo Suave", value: "bg-yellow-50 border-yellow-200" },
  { name: "Cinza Suave", value: "bg-gray-50 border-gray-200" },
];

export default function InteractiveCalendar({
  schedules,
  onDayClick,
  onCreateTask,
  onTaskClick,
  onTaskMove,
  selectedDate,
  onViewModeChange,
  viewMode,
  searchValue = "",
  onSearchChange,
}: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [cellColors, setCellColors] = useState<Record<string, string>>({});

  // Função auxiliar para verificar se é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Função para obter schedules de uma data específica
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  // Navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1);
    // Último dia do mês
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Primeiro dia da semana (domingo = 0)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    // Total de dias no mês
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Adicionar dias do mês anterior para completar a primeira semana
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        schedules: getSchedulesForDate(date),
      });
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        schedules: getSchedulesForDate(date),
      });
    }

    // Adicionar dias do próximo mês para completar a última semana
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        schedules: getSchedulesForDate(date),
      });
    }

    return days;
  }, [currentDate, schedules]);

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  const handleDayClick = (day: CalendarDay) => {
    onDayClick(day.date);
  };

  const handleCreateTask = (day: CalendarDay, e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateTask(day.date);
  };

  const handleColorChange = (dateKey: string, colorClass: string) => {
    setCellColors((prev) => ({
      ...prev,
      [dateKey]: colorClass,
    }));
    setShowColorPicker(null);
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getCellColorClass = (day: CalendarDay) => {
    const dateKey = getDateKey(day.date);
    const customColor = cellColors[dateKey];

    if (customColor) return customColor;

    if (!day.isCurrentMonth) {
      return "bg-gray-50/50 text-gray-400";
    }

    if (day.isToday) {
      return "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900";
    }

    if (
      selectedDate &&
      day.date.toDateString() === selectedDate.toDateString()
    ) {
      return "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900";
    }

    return "bg-white hover:bg-gray-50";
  };

  const getScheduleStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED:
        return <Check className="h-3 w-3 text-green-600" />;
      case ScheduleStatus.IN_PROGRESS:
        return <Clock className="h-3 w-3 text-blue-600" />;
      case ScheduleStatus.PENDING:
        return <Circle className="h-3 w-3 text-yellow-600" />;
      case ScheduleStatus.CANCELLED:
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div className="relative p-10">
      {/* Navegação do Calendário - Centralizada */}
      <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-3 bg-black rounded-full transition-all duration-300 hover:cursor-pointer hover:scale-120"
        >
          <ChevronLeft className="hover:text-purple-200 h-8 w-8 text-gray-600" />
        </button>
        <button
          onClick={goToNextMonth}
          className="p-3 rounded-full transition-all duration-300 hover:cursor-pointer hover:scale-120"
        >
          <ChevronRight className="hover:text-purple-200 h-8 w-8 text-gray-600" />
        </button>
      </div>
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {formatMonthYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* Opções de Visualização */}
        {onViewModeChange && (
          <ViewModeSelector
            currentView={viewMode || "calendar"}
            onViewChange={onViewModeChange}
            showSearch={true}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
          />
        )}
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
          <div
            key={index}
            className="h-12 flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade do Calendário */}
      <div className="grid grid-cols-7 gap-2 overflow-hidden">
        {calendarDays.map((day, index) => {
          const dateKey = getDateKey(day.date);
          const isColorPickerOpen = showColorPicker === dateKey;

          const handleTaskDrop = (schedule: Schedule) => {
            if (onTaskMove && schedule.id) {
              onTaskMove(schedule.id, day.date);
            }
          };

          return (
            <DropZone
              key={index}
              onDrop={handleTaskDrop}
              className={`relative h-28 rounded-xl overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-200 hover:border-purple-200 group ${getCellColorClass(
                day
              )} `}
              dropIndicatorClass="ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/50"
            >
              <div
                onClick={() => handleDayClick(day)}
                className="h-full w-full"
              >
                {/* Número do Dia */}
                <div className="p-2 flex items-start justify-between">
                  <span
                    className={`text-sm font-medium ${
                      !day.isCurrentMonth ? "text-gray-400" : ""
                    }`}
                  >
                    {day.date.getDate()}
                  </span>

                  {/* Botões de Ação */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={(e) => handleCreateTask(day, e)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Criar Task"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(isColorPickerOpen ? null : dateKey);
                      }}
                      className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                      title="Alterar Cor"
                    >
                      <Palette className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Tasks Draggable */}
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="flex flex-wrap gap-1">
                    {day.schedules.slice(0, 2).map((schedule, idx) => (
                      <DraggableTask
                        key={`${schedule.id}-${idx}`}
                        schedule={schedule}
                        onClick={onTaskClick}
                        size="small"
                        showDetails={false}
                      />
                    ))}
                    {day.schedules.length > 2 && (
                      <div
                        className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Mostrar modal com todas as tasks do dia ou expandir lista
                        }}
                        title={`Ver todas as ${day.schedules.length} tasks`}
                      >
                        <span className="text-xs text-gray-600 font-bold">
                          +{day.schedules.length - 2}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Picker Dropdown */}
                {isColorPickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border p-3 min-w-48">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Escolher Cor
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {CALENDAR_COLORS.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(dateKey, color.value);
                          }}
                          className={`p-2 rounded text-xs text-center transition-colors ${
                            color.value || "bg-gray-100 hover:bg-gray-200"
                          }`}
                          title={color.name}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DropZone>
          );
        })}
      </div>
    </div>
  );
}
