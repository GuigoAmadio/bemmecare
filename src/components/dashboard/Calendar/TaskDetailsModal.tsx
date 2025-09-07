"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  Flag,
  Tag,
  FileText,
  Save,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  User,
  MapPin,
  Bell,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Schedule,
  ScheduleStatus,
  ScheduleCategory,
  SchedulePriority,
  UpdateScheduleInput,
  getScheduleStatusLabel,
  getScheduleCategoryLabel,
  getSchedulePriorityLabel,
  getScheduleCategoryColor,
  getSchedulePriorityColor,
} from "@/types/schedule";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Schedule | null;
  onUpdate: (taskData: UpdateScheduleInput) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: ScheduleStatus) => void;
  isLoading?: boolean;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
  onStatusChange,
  isLoading = false,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateScheduleInput | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || "",
        date: task.date.split("T")[0],
        category: task.category,
        priority: task.priority,
        status: task.status,
        allDay: task.allDay,
        isPublic: task.isPublic,
        startTime: task.startTime
          ? new Date(task.startTime).toTimeString().slice(0, 5)
          : "",
        endTime: task.endTime
          ? new Date(task.endTime).toTimeString().slice(0, 5)
          : "",
      });
    }
  }, [task]);

  const handleInputChange = (field: keyof UpdateScheduleInput, value: any) => {
    if (!formData) return;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData) return false;

    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.allDay && formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "Horário de fim deve ser posterior ao início";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!formData || !validateForm()) return;

    const updateData: UpdateScheduleInput = {
      ...formData,
      startTime: formData.allDay
        ? undefined
        : formData.startTime
        ? new Date(`${formData.date}T${formData.startTime}`).toISOString()
        : undefined,
      endTime: formData.allDay
        ? undefined
        : formData.endTime
        ? new Date(`${formData.date}T${formData.endTime}`).toISOString()
        : undefined,
    };

    onUpdate(updateData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: ScheduleStatus) => {
    if (!task) return;
    onStatusChange(task.id, newStatus);
  };

  const handleDelete = () => {
    if (!task) return;
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setErrors({});
    onClose();
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case ScheduleStatus.IN_PROGRESS:
        return <Play className="h-4 w-4" />;
      case ScheduleStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case ScheduleStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      case ScheduleStatus.POSTPONED:
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: getScheduleCategoryColor(task.category) + "20",
              }}
            >
              <Calendar
                className="h-5 w-5"
                style={{ color: getScheduleCategoryColor(task.category) }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Editar Task" : "Detalhes da Task"}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(task.date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isEditing ? (
            // Edit Mode
            <>
              {/* Título */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Título *</span>
                </label>
                <input
                  type="text"
                  value={formData?.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Digite o título da task..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Descrição</span>
                </label>
                <textarea
                  value={formData?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Descreva os detalhes da task..."
                />
              </div>

              {/* Categoria e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>Categoria</span>
                  </label>
                  <select
                    value={formData?.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {Object.values(ScheduleCategory).map((category) => (
                      <option key={category} value={category}>
                        {getScheduleCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Flag className="h-4 w-4" />
                    <span>Prioridade</span>
                  </label>
                  <select
                    value={formData?.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {Object.values(SchedulePriority).map((priority) => (
                      <option key={priority} value={priority}>
                        {getSchedulePriorityLabel(priority)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Status</span>
                </label>
                <select
                  value={formData?.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {Object.values(ScheduleStatus).map((status) => (
                    <option key={status} value={status}>
                      {getScheduleStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkbox: Dia inteiro */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData?.allDay || false}
                  onChange={(e) =>
                    handleInputChange("allDay", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="allDay"
                  className="text-sm font-medium text-gray-700"
                >
                  Dia inteiro
                </label>
              </div>

              {/* Horários */}
              {!formData?.allDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Horário de Início</span>
                    </label>
                    <input
                      type="time"
                      value={formData?.startTime || ""}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Horário de Fim</span>
                    </label>
                    <input
                      type="time"
                      value={formData?.endTime || ""}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.endTime
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.endTime}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Checkbox: Público */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData?.isPublic || false}
                  onChange={(e) =>
                    handleInputChange("isPublic", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium text-gray-700 flex items-center space-x-2"
                >
                  {formData?.isPublic ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span>Visível para outros usuários</span>
                </label>
              </div>
            </>
          ) : (
            // View Mode
            <>
              {/* Título e Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mb-4">{task.description}</p>
                  )}
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusIcon(task.status)}
                  <span>{getScheduleStatusLabel(task.status)}</span>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag
                      className="h-5 w-5"
                      style={{ color: getScheduleCategoryColor(task.category) }}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Categoria</p>
                      <p className="font-medium">
                        {getScheduleCategoryLabel(task.category)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Flag
                      className="h-5 w-5"
                      style={{ color: getSchedulePriorityColor(task.priority) }}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Prioridade</p>
                      <p className="font-medium">
                        {getSchedulePriorityLabel(task.priority)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {task.isPublic ? (
                      <Eye className="h-5 w-5 text-green-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Visibilidade</p>
                      <p className="font-medium">
                        {task.isPublic ? "Pública" : "Privada"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-medium">
                        {new Date(task.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {!task.allDay && task.startTime && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium">
                          {new Date(task.startTime).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                          {task.endTime &&
                            ` - ${new Date(task.endTime).toLocaleTimeString(
                              "pt-BR",
                              { hour: "2-digit", minute: "2-digit" }
                            )}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {task.allDay && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium">Dia inteiro</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Ações Rápidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {task.status !== ScheduleStatus.COMPLETED && (
                    <button
                      onClick={() =>
                        handleStatusChange(ScheduleStatus.COMPLETED)
                      }
                      className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Marcar como Concluída</span>
                    </button>
                  )}

                  {task.status !== ScheduleStatus.IN_PROGRESS &&
                    task.status !== ScheduleStatus.COMPLETED && (
                      <button
                        onClick={() =>
                          handleStatusChange(ScheduleStatus.IN_PROGRESS)
                        }
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span>Iniciar</span>
                      </button>
                    )}

                  {task.status !== ScheduleStatus.CANCELLED &&
                    task.status !== ScheduleStatus.COMPLETED && (
                      <button
                        onClick={() =>
                          handleStatusChange(ScheduleStatus.CANCELLED)
                        }
                        className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isLoading ? "Salvando..." : "Salvar Alterações"}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Deletar Task
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar a task &quot;{task.title}&quot;? Esta ação
                não pode ser desfeita.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
