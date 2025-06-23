"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import {
  getWeekAppointments,
  getAppointmentStats,
  getAppointmentCategories,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/actions/agendamentos";
import type { Appointment, Category } from "@/types";

interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
}

export default function AgendamentosPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data para modal
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    categoryId: "",
    clientName: "",
    clientPhone: "",
    location: "",
    value: 0,
    notes: "",
  });

  // Gerar horários de 7h às 22h (intervalo de 30 min)
  const timeSlots: TimeSlot[] = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeSlots.push({
        hour,
        minute,
        display: `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`,
      });
    }
  }

  // Gerar dias da semana atual
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Domingo = 0
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Carregar dados do backend
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Carregar agendamentos da semana
        const weekStart = weekDays[0].toISOString().split("T")[0];
        const appointmentsResult = await getWeekAppointments(weekStart);
        if (appointmentsResult.success && appointmentsResult.data) {
          setAppointments(appointmentsResult.data);
        }

        // Carregar categorias
        const categoriesResult = await getAppointmentCategories();
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

        // Carregar estatísticas
        const statsResult = await getAppointmentStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [currentWeek]);

  // Navegação da semana
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // Funções de drag & drop
  const handleDragStart = (e: React.DragEvent, category: Category) => {
    setDraggedCategory(category);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    if (!draggedCategory) return;

    // Calcular horário de fim (1 hora depois)
    const [hour, minute] = time.split(":").map(Number);
    const endHour = minute === 30 ? hour + 1 : hour;
    const endMinute = minute === 30 ? 0 : 30;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    // Abrir modal para completar dados
    setFormData({
      title: `Sessão de ${draggedCategory.name}`,
      date,
      startTime: time,
      endTime,
      categoryId: draggedCategory.id,
      clientName: "",
      clientPhone: "",
      location: "",
      value: 0,
      notes: "",
    });
    setIsEditing(false);
    setShowModal(true);
    setDraggedCategory(null);
  };

  // Obter agendamentos para um dia/horário específico
  const getAppointmentForSlot = (date: string, time: string) => {
    return appointments.find(
      (apt) => apt.date === date && apt.startTime === time
    );
  };

  // Abrir modal de detalhes
  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      title: appointment.title,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      categoryId: appointment.category.id,
      clientName: appointment.client.name,
      clientPhone: appointment.client.phone,
      location: appointment.location,
      value: appointment.value,
      notes: appointment.notes || "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Salvar agendamento
  const handleSave = () => {
    if (!formData.clientName || !formData.startTime) return;

    const category = categories.find((c) => c.id === formData.categoryId);
    if (!category) return;

    const newAppointment: Appointment = {
      id: selectedAppointment?.id || Date.now().toString(),
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      date: formData.date,
      category,
      client: {
        name: formData.clientName,
        phone: formData.clientPhone,
      },
      location: formData.location,
      value: formData.value,
      notes: formData.notes,
    };

    if (selectedAppointment) {
      // Editar existente
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id ? newAppointment : apt
        )
      );
    } else {
      // Adicionar novo
      setAppointments((prev) => [...prev, newAppointment]);
    }

    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Excluir agendamento
  const handleDelete = () => {
    if (!selectedAppointment) return;

    setAppointments((prev) =>
      prev.filter((apt) => apt.id !== selectedAppointment.id)
    );
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Estatísticas da semana
  const weekStats = {
    total: appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return weekDays.some(
        (day) => day.toDateString() === aptDate.toDateString()
      );
    }).length,
    revenue: appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date);
        return weekDays.some(
          (day) => day.toDateString() === aptDate.toDateString()
        );
      })
      .reduce((sum, apt) => sum + apt.value, 0),
    today: appointments.filter(
      (apt) => apt.date === new Date().toISOString().split("T")[0]
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-2">Calendário semanal interativo</p>
        </div>
        <button
          onClick={() => {
            setSelectedAppointment(null);
            setFormData({
              title: "",
              date: new Date().toISOString().split("T")[0],
              startTime: "09:00",
              endTime: "10:00",
              categoryId: categories[0].id,
              clientName: "",
              clientPhone: "",
              location: "",
              value: 0,
              notes: "",
            });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {weekStats.total}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Receita Semanal
              </p>
              <p className="text-2xl font-bold text-green-600">
                R${" "}
                {weekStats.revenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoje</p>
              <p className="text-2xl font-bold text-purple-600">
                {weekStats.today}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Navegação da semana */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {weekDays[0].toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Hoje
            </button>
          </div>

          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Categorias Arrastáveis */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Arraste para agendar:
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              draggable
              onDragStart={(e) => handleDragStart(e, category)}
              className={`px-4 py-2 rounded-lg border cursor-move hover:shadow-md transition-shadow ${category.bgColor} ${category.borderColor} ${category.color}`}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {/* Calendário Semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-gray-50 text-center text-sm font-medium text-gray-700">
            Horário
          </div>
          {weekDays.map((day, index) => (
            <div
              key={day.toISOString()}
              className={`p-4 text-center border-l border-gray-200 ${
                day.toDateString() === new Date().toDateString()
                  ? "bg-primary/10 text-primary font-semibold"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <div className="text-sm font-medium">{dayNames[index]}</div>
              <div className="text-lg">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Grade de horários */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((slot) => (
            <div
              key={slot.display}
              className="grid grid-cols-8 border-b border-gray-100"
            >
              {/* Coluna de horário */}
              <div className="p-3 bg-gray-50 text-center text-sm text-gray-600 border-r border-gray-200">
                {slot.display}
              </div>

              {/* Colunas dos dias */}
              {weekDays.map((day) => {
                const dateStr = day.toISOString().split("T")[0];
                const appointment = getAppointmentForSlot(
                  dateStr,
                  slot.display
                );

                return (
                  <div
                    key={`${dateStr}-${slot.display}`}
                    className="p-2 border-l border-gray-100 min-h-[60px] relative"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dateStr, slot.display)}
                  >
                    {appointment ? (
                      <div
                        onClick={() => openAppointmentModal(appointment)}
                        className={`w-full h-full rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow ${appointment.category.bgColor} ${appointment.category.borderColor} border`}
                      >
                        <div
                          className={`text-xs font-medium ${appointment.category.color}`}
                        >
                          {appointment.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {appointment.client.name}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-lg border-2 border-dashed border-transparent hover:border-gray-300 transition-colors"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAppointment
                  ? "Detalhes do Agendamento"
                  : "Novo Agendamento"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedAppointment && !isEditing ? (
              // Visualização
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${selectedAppointment.category.bgColor}`}
                >
                  <h4
                    className={`font-semibold ${selectedAppointment.category.color}`}
                  >
                    {selectedAppointment.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAppointment.category.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Horário
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.startTime} -{" "}
                      {selectedAppointment.endTime}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cliente
                  </label>
                  <p className="text-gray-900">
                    {selectedAppointment.client.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.client.phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Local
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valor
                    </label>
                    <p className="text-gray-900">
                      R${" "}
                      {selectedAppointment.value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Observações
                    </label>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ) : (
              // Formulário de edição/criação
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Início *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fim *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientPhone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          value: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
