"use client";

import { useState } from "react";
import {
  Database,
  RefreshCw,
  Plus,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Trash2,
} from "lucide-react";
import { useMockData } from "@/context/MockDataContext";
import { generateMockSchedule } from "@/hooks/useMockSchedules";
import { Schedule } from "@/types/schedule";

interface MockDataDemoProps {
  onDataLoaded?: (schedules: Schedule[]) => void;
  className?: string;
}

export default function MockDataDemo({
  onDataLoaded,
  className = "",
}: MockDataDemoProps) {
  const {
    schedules,
    statistics,
    loading,
    error,
    isMockDataActive,
    loadMockData,
    addMockSchedule,
    clearMockData,
    exportMockData,
    getUpcomingSchedules,
    getOverdueSchedules,
    getTodaySchedules,
  } = useMockData();

  const [showStats, setShowStats] = useState(false);

  const handleLoadMockData = () => {
    loadMockData();
    if (onDataLoaded) {
      onDataLoaded(schedules);
    }
  };

  const handleAddRandomSchedule = () => {
    const newSchedule = generateMockSchedule();
    addMockSchedule(newSchedule);
  };

  const handleGenerateMultiple = () => {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const newSchedule = generateMockSchedule();
      addMockSchedule(newSchedule);
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Carregando dados mockup...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
      >
        <div className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Erro:</span>
          <span>{error}</span>
        </div>
        <button
          onClick={loadMockData}
          className="mt-3 flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Tentar Novamente</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dados Mockup
            </h3>
            <p className="text-sm text-gray-600">
              {schedules.length} schedules carregados para teste
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ver estatísticas"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            onClick={loadMockData}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Recarregar dados"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button
          onClick={handleLoadMockData}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Usar Dados</span>
        </button>

        <button
          onClick={handleAddRandomSchedule}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar 1</span>
        </button>

        <button
          onClick={handleGenerateMultiple}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar 5</span>
        </button>

        <button
          onClick={exportMockData}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </button>

        {isMockDataActive && (
          <button
            onClick={clearMockData}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {schedules.length}
          </div>
          <div className="text-xs text-blue-600">Total</div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {getTodaySchedules().length}
          </div>
          <div className="text-xs text-green-600">Hoje</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {getUpcomingSchedules().length}
          </div>
          <div className="text-xs text-yellow-600">Próximos 7 dias</div>
        </div>

        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {getOverdueSchedules().length}
          </div>
          <div className="text-xs text-red-600">Atrasados</div>
        </div>
      </div>

      {/* Detailed Statistics */}
      {showStats && statistics && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Estatísticas Detalhadas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* By Status */}
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">
                Por Status
              </h5>
              <div className="space-y-1">
                {Object.entries(statistics.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Category */}
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">
                Por Categoria
              </h5>
              <div className="space-y-1">
                {Object.entries(statistics.byCategory).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* By Priority */}
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">
                Por Prioridade
              </h5>
              <div className="space-y-1">
                {Object.entries(statistics.byPriority).map(
                  ([priority, count]) => (
                    <div
                      key={priority}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{priority}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.publicTasks}
              </div>
              <div className="text-xs text-gray-600">Públicas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.privateTasks}
              </div>
              <div className="text-xs text-gray-600">Privadas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.recurringTasks}
              </div>
              <div className="text-xs text-gray-600">Recorrentes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.withReminders}
              </div>
              <div className="text-xs text-gray-600">Com Lembretes</div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {schedules.length > 0 && (
        <div className="mt-6 flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">
            {isMockDataActive
              ? "Dados mockup ativos no calendário! Você pode visualizar e interagir com eles."
              : "Dados mockup carregados com sucesso! Use o botão 'Usar Dados' para aplicar no calendário."}
          </span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Como Usar:</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • <strong>Usar Dados:</strong> Carrega os schedules no calendário
          </li>
          <li>
            • <strong>Adicionar:</strong> Gera novos schedules aleatórios
          </li>
          <li>
            • <strong>Exportar:</strong> Baixa os dados atuais em JSON
          </li>
          <li>
            • <strong>Recarregar:</strong> Volta aos dados originais
          </li>
          <li>
            • <strong>Limpar:</strong> Remove dados mockup e volta aos dados
            originais
          </li>
        </ul>
      </div>
    </div>
  );
}
