"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  X, 
  Calendar,
  Clock,
  Tag,
  Flag,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { 
  Schedule, 
  ScheduleStatus, 
  ScheduleCategory, 
  SchedulePriority,
  getScheduleStatusLabel,
  getScheduleCategoryLabel,
  getSchedulePriorityLabel
} from "@/types/schedule";
import DraggableTask from "./DraggableTask";

interface GlobalSearchProps {
  schedules: Schedule[];
  onTaskClick?: (task: Schedule) => void;
  onClose: () => void;
}

type SortField = "date" | "title" | "status" | "priority" | "category";
type SortOrder = "asc" | "desc";

export default function GlobalSearch({ schedules, onTaskClick, onClose }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<ScheduleCategory | "">("");
  const [priorityFilter, setPriorityFilter] = useState<SchedulePriority | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar e ordenar schedules
  const filteredAndSortedSchedules = useMemo(() => {
    let filtered = schedules;

    // Busca por texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(schedule => 
        schedule.title.toLowerCase().includes(searchLower) ||
        schedule.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtros
    if (statusFilter) {
      filtered = filtered.filter(schedule => schedule.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(schedule => schedule.category === categoryFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(schedule => schedule.priority === priorityFilter);
    }

    // Filtro de data
    if (dateFrom) {
      filtered = filtered.filter(schedule => 
        new Date(schedule.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(schedule => 
        new Date(schedule.date) <= new Date(dateTo)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "priority":
          // Ordenar por prioridade: URGENT > HIGH > MEDIUM > LOW
          const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [schedules, searchTerm, statusFilter, categoryFilter, priorityFilter, dateFrom, dateTo, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setPriorityFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = statusFilter || categoryFilter || priorityFilter || dateFrom || dateTo;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Busca Global</h2>
              <p className="text-sm text-gray-600">
                {filteredAndSortedSchedules.length} task(s) encontrada(s)
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Ativo
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ScheduleStatus | "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  {Object.values(ScheduleStatus).map(status => (
                    <option key={status} value={status}>
                      {getScheduleStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as ScheduleCategory | "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  {Object.values(ScheduleCategory).map(category => (
                    <option key={category} value={category}>
                      {getScheduleCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as SchedulePriority | "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  {Object.values(SchedulePriority).map(priority => (
                    <option key={priority} value={priority}>
                      {getSchedulePriorityLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data De</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Até</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            {[
              { field: "date", label: "Data", icon: Calendar },
              { field: "title", label: "Título", icon: Tag },
              { field: "status", label: "Status", icon: Clock },
              { field: "priority", label: "Prioridade", icon: Flag },
            ].map(({ field, label, icon: Icon }) => (
              <button
                key={field}
                onClick={() => handleSort(field as SortField)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                  sortField === field
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
                {sortField === field && (
                  sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] p-6">
          {filteredAndSortedSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma task encontrada</p>
              <p className="text-gray-400 text-sm">Tente ajustar seus termos de busca ou filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  onClick={() => onTaskClick?.(schedule)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                      {schedule.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                    <DraggableTask
                      schedule={schedule}
                      size="medium"
                      showDetails={false}
                    />
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(schedule.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    {!schedule.allDay && schedule.startTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(schedule.startTime).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{getScheduleCategoryLabel(schedule.category)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flag className="h-3 w-3" />
                      <span>{getSchedulePriorityLabel(schedule.priority)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredAndSortedSchedules.length} de {schedules.length} tasks
            </span>
            <span>
              Clique em uma task para ver detalhes • Arraste para mover no calendário
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
