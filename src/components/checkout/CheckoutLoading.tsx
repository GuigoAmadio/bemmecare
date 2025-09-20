"use client";

import { useEffect, useState } from "react";
import { CheckCircle, CreditCard, Package, Truck } from "lucide-react";
import Card from "@/components/ui/Card";

interface CheckoutLoadingProps {
  isVisible: boolean;
}

export default function CheckoutLoading({ isVisible }: CheckoutLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Processando Pagamento",
      description: "Validando informações do cartão...",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Pagamento Aprovado",
      description: "Transação realizada com sucesso!",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Preparando Pedido",
      description: "Organizando seus produtos...",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Pedido Confirmado",
      description: "Redirecionando para confirmação...",
    },
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="space-y-6">
          {/* Ícone Principal */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="text-primary">{steps[currentStep]?.icon}</div>
            </div>
          </div>

          {/* Título e Descrição */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-text-secondary">
              {steps[currentStep]?.description}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Mensagem de Segurança */}
          <div className="text-xs text-text-muted">
            <p>🔒 Processamento seguro</p>
            <p>Não feche esta janela</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
