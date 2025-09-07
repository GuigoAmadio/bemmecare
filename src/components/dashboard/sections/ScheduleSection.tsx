"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  List,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Users,
  CalendarDays,
  Search,
  Database,
} from "lucide-react";
import {
  Schedule,
  ScheduleStatus,
  ScheduleCategory,
  SchedulePriority,
  CreateScheduleInput,
  UpdateScheduleInput,
  getScheduleStatusLabel,
  getScheduleCategoryLabel,
} from "@/types/schedule";
import { useScheduleContext } from "@/context/ScheduleContext";
import InteractiveCalendar from "../Calendar/InteractiveCalendar";
import CreateTaskModal from "../Calendar/CreateTaskModal";
import TaskDetailsModal from "../Calendar/TaskDetailsModal";
import CalendarFilters, {
  CalendarFiltersState,
} from "../Calendar/CalendarFilters";
import WeeklyView from "../Calendar/WeeklyView";
import ViewModeSelector from "../Calendar/ViewModeSelector";
import GlobalSearch from "../Calendar/GlobalSearch";
import ReminderSystem from "../Calendar/ReminderSystem";

interface ScheduleSectionProps {
  onBack: () => void;
}

export default function ScheduleSection({ onBack }: ScheduleSectionProps) {
  // Usar contexto para dados de schedule
  const {
    schedules,
    loading,
    error,
    createSchedule: createScheduleAction,
    updateSchedule: updateScheduleAction,
    deleteSchedule: deleteScheduleAction,
    updateScheduleStatus: updateScheduleStatusAction,
  } = useScheduleContext();

  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<
    "calendar" | "weekly" | "list" | "stats"
  >("calendar");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Schedule | null>(null);
  const [createTaskDate, setCreateTaskDate] = useState<Date>(new Date());

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Global search
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<CalendarFiltersState>({
    search: "",
    categories: [],
    statuses: [],
    priorities: [],
    dateRange: { start: "", end: "" },
    showPublicOnly: false,
    showPrivateOnly: false,
  });

  // Não precisamos mais carregar dados aqui, o contexto já faz isso

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTask = (date: Date) => {
    setCreateTaskDate(date);
    setIsCreateModalOpen(true);
  };

  const handleSubmitTask = async (taskData: CreateScheduleInput) => {
    try {
      setIsCreating(true);

      const success = await createScheduleAction(taskData);

      if (success) {
        setIsCreateModalOpen(false);
      } else {
        console.error("❌ Erro ao criar task");
      }
    } catch (error) {
      console.error("❌ Erro ao criar task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTaskClick = (task: Schedule) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateTask = async (taskData: UpdateScheduleInput) => {
    try {
      setIsUpdating(true);

      const success = await updateScheduleAction(taskData.id, taskData);

      if (!success) {
        console.error("❌ Erro ao atualizar task");
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsUpdating(true);

      const success = await deleteScheduleAction(taskId);

      if (success) {
        setIsDetailsModalOpen(false);
        setSelectedTask(null);
      } else {
        console.error("❌ Erro ao deletar task");
      }
    } catch (error) {
      console.error("❌ Erro ao deletar task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: ScheduleStatus) => {
    try {
      const success = await updateScheduleStatusAction(taskId, status);

      if (!success) {
        console.error("❌ Erro ao atualizar status");
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...schedules];

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (schedule) =>
          schedule.title.toLowerCase().includes(searchLower) ||
          schedule.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoria
    if (filters.categories.length > 0) {
      filtered = filtered.filter((schedule) =>
        filters.categories.includes(schedule.category)
      );
    }

    // Filtro de status
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((schedule) =>
        filters.statuses.includes(schedule.status)
      );
    }

    // Filtro de prioridade
    if (filters.priorities.length > 0) {
      filtered = filtered.filter((schedule) =>
        filters.priorities.includes(schedule.priority)
      );
    }

    // Filtro de data
    if (filters.dateRange.start) {
      filtered = filtered.filter(
        (schedule) =>
          new Date(schedule.date) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(
        (schedule) => new Date(schedule.date) <= new Date(filters.dateRange.end)
      );
    }

    // Filtro de visibilidade
    if (filters.showPublicOnly) {
      filtered = filtered.filter((schedule) => schedule.isPublic);
    }
    if (filters.showPrivateOnly) {
      filtered = filtered.filter((schedule) => !schedule.isPublic);
    }

    setFilteredSchedules(filtered);
  }, [schedules, filters]);

  const handleFiltersChange = (newFilters: CalendarFiltersState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      statuses: [],
      priorities: [],
      dateRange: { start: "", end: "" },
      showPublicOnly: false,
      showPrivateOnly: false,
    });
  };

  const handleTaskMove = async (taskId: string, newDate: Date) => {
    try {
      const task = schedules.find((s) => s.id === taskId);
      if (!task) {
        console.log("❌ Task não encontrada:", taskId);
        return;
      }

      const updateData: UpdateScheduleInput = {
        id: taskId,
        date: newDate.toISOString().split("T")[0],
        // Manter o mesmo horário se existir, caso contrário usar o dia inteiro
        startTime:
          task.startTime && !task.allDay
            ? new Date(
                `${newDate.toISOString().split("T")[0]}T${new Date(
                  task.startTime
                )
                  .toTimeString()
                  .slice(0, 8)}`
              ).toISOString()
            : undefined,
        endTime:
          task.endTime && !task.allDay
            ? new Date(
                `${newDate.toISOString().split("T")[0]}T${new Date(task.endTime)
                  .toTimeString()
                  .slice(0, 8)}`
              ).toISOString()
            : undefined,
      };

      const success = await updateScheduleAction(taskId, updateData);

      if (!success) {
        console.error("❌ Erro ao mover task");
      }
    } catch (error) {
      console.error("❌ Erro ao mover task:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Agenda</h1>
              <p className="text-text-muted">Organize compromissos e eventos</p>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-4 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-text-muted">Carregando agenda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Botão de voltar em posição absoluta */}
      <button
        onClick={onBack}
        className="absolute top-0 left-0 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
      </button>

      {/* Content based on view mode */}
      {viewMode === "calendar" && (
        <>
          <InteractiveCalendar
            schedules={schedules}
            onDayClick={handleDayClick}
            onCreateTask={handleCreateTask}
            selectedDate={selectedDate}
            onTaskClick={handleTaskClick}
            onTaskMove={handleTaskMove}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchValue={filters.search}
            onSearchChange={(value) =>
              handleFiltersChange({ ...filters, search: value })
            }
          />
        </>
      )}

      {viewMode === "weekly" && (
        <WeeklyView
          schedules={schedules}
          selectedDate={selectedDate}
          onDateChange={handleDayClick}
          onCreateTask={handleCreateTask}
          onTaskClick={handleTaskClick}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={filters.search}
          onSearchChange={(value) =>
            handleFiltersChange({ ...filters, search: value })
          }
        />
      )}

      {viewMode === "list" && (
        <div className="p-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lista de Tasks
            </h3>
            {/* ViewModeSelector */}
            <ViewModeSelector
              currentView={viewMode}
              onViewChange={setViewMode}
              showSearch={true}
              searchValue={filters.search}
              onSearchChange={(value) =>
                handleFiltersChange({ ...filters, search: value })
              }
            />
          </div>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma task encontrada</p>
              <button
                onClick={() => handleCreateTask(new Date())}
                className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Nova Task</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  onClick={() => handleTaskClick(schedule)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {schedule.title}
                      </h4>
                      {schedule.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {schedule.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          {new Date(schedule.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="capitalize">
                          {getScheduleCategoryLabel(schedule.category)}
                        </span>
                        <span className="capitalize">
                          {getScheduleStatusLabel(schedule.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {schedule.status === ScheduleStatus.COMPLETED && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {schedule.status === ScheduleStatus.IN_PROGRESS && (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      {schedule.status === ScheduleStatus.PENDING && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSchedules.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredSchedules.filter(
                      (s) => s.status === ScheduleStatus.COMPLETED
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    filteredSchedules.filter(
                      (s) => s.status === ScheduleStatus.PENDING
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Públicas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSchedules.filter((s) => s.isPublic).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitTask}
        selectedDate={createTaskDate}
        isLoading={isCreating}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        isLoading={isUpdating}
      />

      {isGlobalSearchOpen && (
        <GlobalSearch
          schedules={schedules}
          onTaskClick={handleTaskClick}
          onClose={() => setIsGlobalSearchOpen(false)}
        />
      )}
    </div>
  );
}
