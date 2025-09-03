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
// import {
//   getSchedules,
//   createSchedule,
//   updateSchedule,
//   deleteSchedule,
//   updateScheduleStatus,
// } from "@/actions/schedules";
// import { cacheHelpers } from "@/lib/cache-utils";
import { useMockData } from "@/context/MockDataContext";
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
import MockDataDemo from "../Calendar/MockDataDemo";
import MockDataNotification from "../Calendar/MockDataNotification";

interface ScheduleSectionProps {
  onBack: () => void;
}

export default function ScheduleSection({ onBack }: ScheduleSectionProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Log quando schedules mudar
  useEffect(() => {
    console.log("📊 Estado schedules mudou para:", schedules.length);
  }, [schedules]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<
    "calendar" | "weekly" | "list" | "stats" | "mockup"
  >("calendar");

  // Mock Data Context
  const {
    isMockDataActive,
    schedules: mockSchedules,
    clearMockData,
  } = useMockData();

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

  // Mock data notification
  const [showMockDataNotification, setShowMockDataNotification] =
    useState(false);

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

  useEffect(() => {
    // Só carregar se não houver dados mockup ativos
    if (!isMockDataActive) {
      loadSchedule();
    }
  }, [isMockDataActive]);

  // Recarregar dados quando dados mockup mudarem
  useEffect(() => {
    console.log(
      "🔄 useEffect mockup - isMockDataActive:",
      isMockDataActive,
      "mockSchedules.length:",
      mockSchedules.length
    );

    if (isMockDataActive && mockSchedules.length > 0) {
      console.log("🔄 Dados mockup atualizados, recarregando agenda");
      console.log("📊 Dados mockup:", mockSchedules);
      setSchedules(mockSchedules);
      setShowMockDataNotification(true);
      console.log("✅ Estado schedules atualizado para:", mockSchedules.length);
    }
  }, [isMockDataActive, mockSchedules]);

  // Recarregar quando dados mockup mudarem
  useEffect(() => {
    if (isMockDataActive && mockSchedules.length > 0) {
      loadSchedule();
    }
  }, [isMockDataActive, mockSchedules]);

  const loadSchedule = async () => {
    try {
      setLoading(true);

      // Se dados mockup estiverem ativos, usá-los
      if (isMockDataActive && mockSchedules.length > 0) {
        console.log("📦 Usando dados mockup ativos:", mockSchedules.length);
        setSchedules(mockSchedules);
        setLoading(false);
        return;
      }

      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - usando apenas dados mockup");

      // Dados mockup padrão quando não há dados mockup ativos
      const defaultMockSchedules: Schedule[] = [
        {
          id: "1",
          clientId: "client-1",
          userId: "user-1",
          title: "Reunião de Planejamento",
          description: "Discussão sobre metas do próximo trimestre",
          date: new Date().toISOString(),
          tasks: [],
          status: ScheduleStatus.PENDING,
          priority: SchedulePriority.HIGH,
          startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          allDay: false,
          isRecurring: false,
          color: "#3B82F6",
          category: ScheduleCategory.MEETING,
          reminders: [],
          attachments: [],
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          clientId: "client-1",
          userId: "user-1",
          title: "Consulta com Cliente Premium",
          description: "Revisão de portfólio de investimentos",
          date: new Date(Date.now() + 86400000).toISOString(),
          tasks: [],
          status: ScheduleStatus.IN_PROGRESS,
          priority: SchedulePriority.HIGH,
          startTime: new Date(
            Date.now() + 86400000 + 2 * 60 * 60 * 1000
          ).toISOString(),
          endTime: new Date(
            Date.now() + 86400000 + 3 * 60 * 60 * 1000
          ).toISOString(),
          allDay: false,
          isRecurring: false,
          color: "#F59E0B",
          category: ScheduleCategory.APPOINTMENT,
          reminders: [],
          attachments: [],
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setSchedules(defaultMockSchedules);
      console.log(
        "✅ Dados mockup padrão carregados:",
        defaultMockSchedules.length
      );
    } catch (error) {
      console.error("❌ Erro ao carregar agenda:", error);
    } finally {
      setLoading(false);
    }
  };

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
      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - simulando criação de task");

      // Simular criação local
      const newTask: Schedule = {
        ...taskData,
        id: `mock-${Date.now()}`,
        clientId: "mock-client",
        userId: "mock-user",
        tasks: [],
        status: ScheduleStatus.PENDING,
        priority: SchedulePriority.MEDIUM,
        allDay: false,
        isRecurring: false,
        color: "#3B82F6",
        category: ScheduleCategory.OTHER,
        reminders: [],
        attachments: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSchedules((prev) => [...prev, newTask]);
      setIsCreateModalOpen(false);
      console.log("✅ Task criada localmente (simulação):", newTask.title);
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
      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - simulando atualização");

      // Simular atualização local
      const updatedTask = { ...selectedTask, ...taskData } as Schedule;
      if (updatedTask) {
        setSchedules((prev) =>
          prev.map((task) => (task.id === taskData.id ? updatedTask : task))
        );
        console.log("✅ Task atualizada localmente (simulação)");
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
      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - simulando exclusão");

      // Simular exclusão local
      setSchedules((prev) => prev.filter((task) => task.id !== taskId));
      setIsDetailsModalOpen(false);
      setSelectedTask(null);
      console.log("✅ Task deletada localmente (simulação)");
    } catch (error) {
      console.error("❌ Erro ao deletar task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: ScheduleStatus) => {
    try {
      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - simulando mudança de status");

      // Simular mudança de status local
      setSchedules((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task))
      );
      console.log("✅ Status atualizado localmente (simulação)");
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    console.log("🔍 Aplicando filtros para schedules:", schedules.length);
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
      if (!task) return;

      const updatedTask = {
        ...task,
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

      // TEMPORARIAMENTE DESABILITADO - FOCANDO APENAS EM DADOS MOCKUP
      console.log("🚫 Backend desabilitado - simulando movimentação de task");

      // Simular movimentação local
      setSchedules((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      console.log("✅ Task movida localmente (simulação)");
    } catch (error) {
      console.error("❌ Erro ao mover task:", error);
    }
  };

  // Função para carregar dados mockup no calendário
  const handleMockDataLoaded = (mockSchedules: Schedule[]) => {
    console.log(
      "📦 Carregando dados mockup no calendário:",
      mockSchedules.length
    );
    setSchedules(mockSchedules);

    // Salvar no cache para persistir entre navegações
    // if (cacheHelpers.schedules) {
    //   cacheHelpers.schedules.set("all", mockSchedules);
    // }

    // Voltar para o modo calendário para ver os dados
    setViewMode("calendar");
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
          {console.log(
            "🎯 Renderizando calendário com schedules:",
            schedules.length
          )}
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

      {viewMode === "mockup" && (
        <MockDataDemo
          onDataLoaded={handleMockDataLoaded}
          className="max-w-4xl mx-auto"
        />
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

      {/* Mock Data Notification */}
      <MockDataNotification
        isActive={isMockDataActive}
        scheduleCount={schedules.length}
        onClose={() => setShowMockDataNotification(false)}
      />
    </div>
  );
}
