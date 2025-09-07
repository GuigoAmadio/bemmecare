"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  Flag,
  Tag,
  User,
  FileText,
  Save,
} from "lucide-react";
import {
  ScheduleStatus,
  ScheduleCategory,
  SchedulePriority,
  CreateScheduleInput,
  getScheduleCategoryLabel,
  getSchedulePriorityLabel,
} from "@/types/schedule";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateScheduleInput) => void;
  selectedDate: Date;
  isLoading?: boolean;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  isLoading = false,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateScheduleInput>({
    title: "",
    description: "",
    date: selectedDate.toISOString().split("T")[0],
    category: ScheduleCategory.WORK,
    priority: SchedulePriority.MEDIUM,
    status: ScheduleStatus.PENDING,
    allDay: false,
    isPublic: false,
    startTime: "",
    endTime: "",
    tasks: [],
    reminders: [],
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateScheduleInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Preparar dados para envio
    const submitData: CreateScheduleInput = {
      ...formData,
      date: selectedDate.toISOString(),
      startTime: formData.allDay
        ? undefined
        : formData.startTime
        ? new Date(
            `${selectedDate.toISOString().split("T")[0]}T${formData.startTime}`
          ).toISOString()
        : undefined,
      endTime: formData.allDay
        ? undefined
        : formData.endTime
        ? new Date(
            `${selectedDate.toISOString().split("T")[0]}T${formData.endTime}`
          ).toISOString()
        : undefined,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: selectedDate.toISOString().split("T")[0],
      category: ScheduleCategory.WORK,
      priority: SchedulePriority.MEDIUM,
      status: ScheduleStatus.PENDING,
      allDay: false,
      isPublic: false,
      startTime: "",
      endTime: "",
      tasks: [],
      reminders: [],
      attachments: [],
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nova Task</h2>
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto h-full"
        >
          {/* Título */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Título *</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
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
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Descreva os detalhes da task..."
            />
          </div>

          {/* Linha 1: Categoria e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4" />
                <span>Categoria</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
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
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
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

          {/* Checkbox: Dia inteiro */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => handleInputChange("allDay", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="allDay"
              className="text-sm font-medium text-gray-700"
            >
              Dia inteiro
            </label>
          </div>

          {/* Horários (apenas se não for dia inteiro) */}
          {!formData.allDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Horário de Início</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
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
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
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
              checked={formData.isPublic}
              onChange={(e) => handleInputChange("isPublic", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isPublic"
              className="text-sm font-medium text-gray-700"
            >
              Visível para outros usuários
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isLoading ? "Criando..." : "Criar Task"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
