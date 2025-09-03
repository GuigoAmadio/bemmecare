"use client";

import { CalendarIcon, CalendarDays, List, Search } from "lucide-react";

interface ViewModeSelectorProps {
  currentView: "calendar" | "weekly" | "list";
  onViewChange: (mode: "calendar" | "weekly" | "list") => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function ViewModeSelector({
  currentView,
  onViewChange,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar tasks...",
}: ViewModeSelectorProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Campo de Busca */}
      {showSearch && onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* Opções de Visualização */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onViewChange("calendar")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            currentView === "calendar"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Calendário</span>
        </button>
        <button
          onClick={() => onViewChange("weekly")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            currentView === "weekly"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Semanal</span>
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            currentView === "list"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <List className="h-4 w-4" />
          <span>Lista</span>
        </button>
      </div>
    </div>
  );
}
