"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  Tag,
  Flag,
  Calendar,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  ScheduleStatus,
  ScheduleCategory,
  SchedulePriority,
  getScheduleStatusLabel,
  getScheduleCategoryLabel,
  getSchedulePriorityLabel,
} from "@/types/schedule";

export interface CalendarFiltersState {
  search: string;
  categories: ScheduleCategory[];
  statuses: ScheduleStatus[];
  priorities: SchedulePriority[];
  dateRange: {
    start: string;
    end: string;
  };
  showPublicOnly: boolean;
  showPrivateOnly: boolean;
}

interface CalendarFiltersProps {
  filters: CalendarFiltersState;
  onFiltersChange: (filters: CalendarFiltersState) => void;
  onClear: () => void;
  compact?: boolean;
}

export default function CalendarFilters({
  filters,
  onFiltersChange,
  onClear,
  compact = false,
}: CalendarFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof CalendarFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleCategory = (category: ScheduleCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const toggleStatus = (status: ScheduleStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    updateFilter("statuses", newStatuses);
  };

  const togglePriority = (priority: SchedulePriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    updateFilter("priorities", newPriorities);
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.categories.length > 0 ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.showPublicOnly ||
      filters.showPrivateOnly
    );
  };

  const getCategoryColor = (category: ScheduleCategory) => {
    switch (category) {
      case ScheduleCategory.WORK:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ScheduleCategory.PERSONAL:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ScheduleCategory.MEETING:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ScheduleCategory.APPOINTMENT:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case ScheduleCategory.REMINDER:
        return "bg-red-100 text-red-800 border-red-200";
      case ScheduleCategory.OTHER:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ScheduleStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ScheduleStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case ScheduleStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      case ScheduleStatus.POSTPONED:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: SchedulePriority) => {
    switch (priority) {
      case SchedulePriority.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      case SchedulePriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case SchedulePriority.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case SchedulePriority.URGENT:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Se for compacto, mostrar apenas o botão de filtros
  if (compact) {
    return (
      <div className="relative flex items-center space-x-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {hasActiveFilters() && (
          <button
            onClick={onClear}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown compacto */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            <div className="space-y-4">
              {/* Categorias */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Categorias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ScheduleCategory).map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                        filters.categories.includes(category)
                          ? getCategoryColor(category)
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {getScheduleCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ScheduleStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                        filters.statuses.includes(status)
                          ? getStatusColor(status)
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {getScheduleStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prioridades */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Prioridades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(SchedulePriority).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => togglePriority(priority)}
                      className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                        filters.priorities.includes(priority)
                          ? getPriorityColor(priority)
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {getSchedulePriorityLabel(priority)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibilidade */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.showPublicOnly}
                    onChange={(e) =>
                      updateFilter("showPublicOnly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Apenas Públicas</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.showPrivateOnly}
                    onChange={(e) =>
                      updateFilter("showPrivateOnly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Apenas Privadas</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Versão completa original
  return (
    <div className="bg-white/80 border border-white/30 relative z-40">
      {/* Header com busca sempre visível */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar tasks..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            hasActiveFilters()
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          {hasActiveFilters() && (
            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {[
                filters.categories.length,
                filters.statuses.length,
                filters.priorities.length,
                filters.dateRange.start ? 1 : 0,
                filters.showPublicOnly ? 1 : 0,
                filters.showPrivateOnly ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>

        {/* Clear Button */}
        {hasActiveFilters() && (
          <button
            onClick={onClear}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="absolute top-10 left-0 border-t border-gray-200 p-4 space-y-6">
          {/* Range de Datas */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Calendar className="h-4 w-4" />
              <span>Período</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      start: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      ...filters.dateRange,
                      end: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Tag className="h-4 w-4" />
              <span>Categorias</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ScheduleCategory).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.categories.includes(category)
                      ? getCategoryColor(category)
                      : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {getScheduleCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Flag className="h-4 w-4" />
              <span>Status</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(ScheduleStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.statuses.includes(status)
                      ? getStatusColor(status)
                      : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {getScheduleStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Prioridades */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Flag className="h-4 w-4" />
              <span>Prioridades</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(SchedulePriority).map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filters.priorities.includes(priority)
                      ? getPriorityColor(priority)
                      : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {getSchedulePriorityLabel(priority)}
                </button>
              ))}
            </div>
          </div>

          {/* Visibilidade */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Eye className="h-4 w-4" />
              <span>Visibilidade</span>
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showPublicOnly}
                  onChange={(e) =>
                    updateFilter("showPublicOnly", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Apenas Públicas</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showPrivateOnly}
                  onChange={(e) =>
                    updateFilter("showPrivateOnly", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Apenas Privadas</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
