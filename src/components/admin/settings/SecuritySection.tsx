"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Key, Smartphone, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SettingsSection from "./SettingsSection";
import { useNotification } from "@/context/NotificationContext";

export default function SecuritySection() {
  const { success, error } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      error("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (passwords.new.length < 8) {
      error("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Senha atualizada com sucesso!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      error("Erro ao atualizar senha.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      success(
        twoFactorEnabled
          ? "Autenticação em duas etapas desabilitada."
          : "Autenticação em duas etapas habilitada!"
      );
    } catch (err) {
      error("Erro ao configurar autenticação em duas etapas.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Segurança"
      description="Configure a segurança da sua conta"
      icon={Shield}
    >
      {/* Alteração de Senha */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Key className="h-4 w-4" />
          Alterar Senha
        </h4>

        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Senha Atual"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Nova Senha"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
                placeholder="Digite a nova senha"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmar Nova Senha"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) =>
                  handlePasswordChange("confirm", e.target.value)
                }
                placeholder="Confirme a nova senha"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordUpdate}
              loading={isLoading}
              disabled={
                !passwords.current || !passwords.new || !passwords.confirm
              }
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              Atualizar Senha
            </Button>
          </div>
        </div>
      </div>

      {/* Autenticação em Duas Etapas */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">
                Autenticação em Duas Etapas
              </h4>
              <p className="text-sm text-gray-600">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
          </div>
          <Button
            onClick={handleTwoFactorToggle}
            loading={isLoading}
            variant={twoFactorEnabled ? "outline" : "primary"}
            size="sm"
          >
            {twoFactorEnabled ? "Desabilitar" : "Habilitar"}
          </Button>
        </div>

        {twoFactorEnabled && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Autenticação em duas etapas está ativa
            </p>
          </div>
        )}
      </div>

      {/* Dicas de Segurança */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">Dicas de Segurança</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Use senhas com pelo menos 8 caracteres</li>
          <li>• Combine letras maiúsculas, minúsculas, números e símbolos</li>
          <li>• Não reutilize senhas de outras contas</li>
          <li>• Habilite a autenticação em duas etapas para maior segurança</li>
        </ul>
      </div>
    </SettingsSection>
  );
}
