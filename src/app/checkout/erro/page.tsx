"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  XCircle,
  RefreshCcw,
  CreditCard,
  AlertTriangle,
  ShoppingCart,
  Home,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface ErrorDetails {
  type: "payment" | "system" | "timeout" | "validation";
  code: string;
  message: string;
  suggestion: string;
  canRetry: boolean;
}

const errorTypes = {
  payment: {
    type: "payment" as const,
    code: "PAYMENT_FAILED",
    message: "Não foi possível processar seu pagamento",
    suggestion: "Verifique os dados do cartão e tente novamente",
    canRetry: true,
  },
  system: {
    type: "system" as const,
    code: "SYSTEM_ERROR",
    message: "Erro interno do sistema",
    suggestion: "Tente novamente em alguns minutos",
    canRetry: true,
  },
  timeout: {
    type: "timeout" as const,
    code: "TIMEOUT",
    message: "Tempo limite excedido",
    suggestion: "A conexão demorou muito para responder",
    canRetry: true,
  },
  validation: {
    type: "validation" as const,
    code: "VALIDATION_ERROR",
    message: "Dados inválidos",
    suggestion: "Verifique as informações e tente novamente",
    canRetry: true,
  },
};

function CheckoutErrorPageContent() {
  const searchParams = useSearchParams();
  const errorType =
    (searchParams.get("type") as keyof typeof errorTypes) || "payment";
  const orderId =
    searchParams.get("order") || "BM-" + Date.now().toString().slice(-6);

  const [errorDetails, setErrorDetails] = useState<ErrorDetails>(
    errorTypes[errorType]
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setErrorDetails(errorTypes[errorType] || errorTypes.payment);
  }, [errorType]);

  const handleRetryPayment = async () => {
    setIsRetrying(true);
    try {
      // Simular retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirecionar para checkout
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Erro ao tentar novamente:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorIcon = () => {
    switch (errorDetails.type) {
      case "payment":
        return <CreditCard className="h-12 w-12 text-error" />;
      case "timeout":
        return <RefreshCcw className="h-12 w-12 text-warning" />;
      case "validation":
        return <AlertTriangle className="h-12 w-12 text-warning" />;
      default:
        return <XCircle className="h-12 w-12 text-error" />;
    }
  };

  const getErrorColor = () => {
    switch (errorDetails.type) {
      case "timeout":
      case "validation":
        return "from-warning/5 via-background to-warning/5";
      default:
        return "from-error/5 via-background to-error/5";
    }
  };

  const commonSolutions = [
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Verifique os dados do cartão",
      description: "Confirme se número, validade e CVV estão corretos",
    },
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      title: "Tente outro método de pagamento",
      description: "Use outro cartão ou forma de pagamento",
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Verifique seu limite",
      description: "Confirme se há limite disponível no cartão",
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getErrorColor()}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header de Erro */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {getErrorIcon()}
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Oops! Algo deu errado 😔
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            {errorDetails.message}
          </p>
          <p className="text-lg text-text-muted">Pedido #{orderId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes do Erro */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Erro */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />O que
                aconteceu?
              </h2>

              <div className="space-y-4">
                <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary mb-1">
                        {errorDetails.message}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {errorDetails.suggestion}
                      </p>
                      <p className="text-xs text-text-muted mt-2">
                        Código do erro: {errorDetails.code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Soluções Comuns */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Como resolver?
              </h2>

              <div className="space-y-4">
                {commonSolutions.map((solution, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-background-secondary rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        {solution.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Informações Adicionais */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Ainda com problemas?
              </h2>

              <div className="prose prose-sm max-w-none text-text-secondary">
                <p>
                  Se o problema persistir, não se preocupe! Nossa equipe está
                  pronta para ajudar. Você pode entrar em contato conosco
                  através dos canais abaixo:
                </p>

                <ul className="space-y-2 mt-4">
                  <li>
                    • Verifique se há atualizações pendentes no seu navegador
                  </li>
                  <li>• Limpe o cache e cookies do navegador</li>
                  <li>• Tente usar outro navegador ou dispositivo</li>
                  <li>• Verifique sua conexão com a internet</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Ações Rápidas
              </h3>

              <div className="space-y-3">
                {errorDetails.canRetry && (
                  <Button
                    onClick={handleRetryPayment}
                    loading={isRetrying}
                    variant="primary"
                    fullWidth
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                )}

                <Link href="/carrinho">
                  <Button variant="outline" fullWidth>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Voltar ao Carrinho
                  </Button>
                </Link>

                <Link href="/checkout">
                  <Button variant="outline" fullWidth>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Novo Checkout
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Suporte */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Precisa de Ajuda?
              </h3>

              <div className="space-y-3">
                <Link href="/contato">
                  <Button variant="outline" fullWidth className="justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Online
                  </Button>
                </Link>

                <Button variant="outline" fullWidth className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  (11) 9999-9999
                </Button>

                <Button variant="outline" fullWidth className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  suporte@bemmecare.com
                </Button>
              </div>
            </Card>

            {/* Status do Sistema */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Status do Sistema
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Pagamentos
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-success">Operacional</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">API</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-xs text-warning">Instável</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Site</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-success">Operacional</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navegação */}
            <div className="space-y-3">
              <Link href="/">
                <Button variant="primary" fullWidth>
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>

              <Link href="/catalogo">
                <Button variant="ghost" fullWidth>
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mensagem de Apoio */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-2xl font-semibold text-text-primary mb-4">
            Não desista! 💪
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Problemas técnicos acontecem, mas nossa equipe está trabalhando para
            resolver rapidamente. Seus produtos favoritos ainda estão no
            carrinho esperando por você!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/carrinho">
              <Button variant="primary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Finalizar Pedido
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline">Falar com Suporte</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Carregando...</p>
          </div>
        </div>
      }
    >
      <CheckoutErrorPageContent />
    </Suspense>
  );
}
