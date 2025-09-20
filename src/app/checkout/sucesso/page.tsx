"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Download,
  ShoppingBag,
  Home,
  Share2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface OrderDetails {
  id: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  estimatedDelivery: string;
}

function CheckoutSuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId =
    searchParams.get("order") || "BM-" + Date.now().toString().slice(-6);

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    id: orderId,
    total: 123.4,
    items: [
      { name: "Óleo Essencial de Lavanda", quantity: 2, price: 45.9 },
      { name: "Creme Hidratante Natural", quantity: 1, price: 32.5 },
    ],
    shippingAddress: {
      name: "João Silva",
      street: "Rua das Flores, 123",
      city: "São Paulo - SP",
      zipCode: "01234-567",
    },
    paymentMethod: "Cartão de Crédito",
    estimatedDelivery: "3-5 dias úteis",
  });

  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Limpar carrinho após compra bem-sucedida
    localStorage.removeItem("cart");

    // Simular carregamento dos detalhes do pedido
    // Em produção, isso viria da API usando o orderId
  }, [orderId]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Pedido Realizado com Sucesso!",
          text: `Meu pedido #${orderDetails.id} foi confirmado na BemmeCare!`,
          url: window.location.href,
        });
      } else {
        // Fallback para browsers sem Web Share API
        await navigator.clipboard.writeText(window.location.href);
        // TODO: Mostrar notificação de link copiado
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadReceipt = () => {
    // Simular download do recibo
    // Em produção, isso geraria/baixaria o PDF do recibo
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Recibo do Pedido #${
          orderDetails.id
        }\nTotal: R$ ${orderDetails.total.toFixed(2)}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `recibo-${orderDetails.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header de Sucesso */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Pedido Confirmado! 🎉
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            Obrigado pela sua compra, seu pedido foi processado com sucesso.
          </p>
          <p className="text-lg text-primary font-semibold">
            Pedido #{orderDetails.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status do Pedido */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Status do Pedido
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">
                      Pedido Confirmado
                    </p>
                    <p className="text-sm text-text-secondary">
                      Seu pedido foi recebido e está sendo processado
                    </p>
                  </div>
                  <span className="text-sm text-success font-medium">
                    Concluído
                  </span>
                </div>

                <div className="flex items-center opacity-50">
                  <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center mr-4">
                    <Package className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-muted">
                      Preparando para Envio
                    </p>
                    <p className="text-sm text-text-muted">
                      Seus produtos estão sendo preparados
                    </p>
                  </div>
                  <span className="text-sm text-text-muted">Aguardando</span>
                </div>

                <div className="flex items-center opacity-50">
                  <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center mr-4">
                    <Truck className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-muted">Em Trânsito</p>
                    <p className="text-sm text-text-muted">
                      Produto saiu para entrega
                    </p>
                  </div>
                  <span className="text-sm text-text-muted">Aguardando</span>
                </div>
              </div>
            </Card>

            {/* Itens do Pedido */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Itens do Pedido
              </h2>

              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between text-xl font-bold text-text-primary">
                  <span>Total do Pedido</span>
                  <span className="text-primary">
                    R$ {orderDetails.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Informações de Entrega */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Informações de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Endereço de Entrega
                  </h3>
                  <div className="text-text-secondary">
                    <p>{orderDetails.shippingAddress.name}</p>
                    <p>{orderDetails.shippingAddress.street}</p>
                    <p>{orderDetails.shippingAddress.city}</p>
                    <p>CEP: {orderDetails.shippingAddress.zipCode}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Prazo de Entrega
                  </h3>
                  <p className="text-text-secondary">
                    {orderDetails.estimatedDelivery}
                  </p>
                  <p className="text-sm text-primary mt-2">
                    Você receberá um código de rastreamento por email
                  </p>
                </div>
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
                <Button
                  onClick={downloadReceipt}
                  variant="outline"
                  fullWidth
                  className="justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Recibo
                </Button>

                <Button
                  onClick={handleShare}
                  loading={isSharing}
                  variant="outline"
                  fullWidth
                  className="justify-start"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>

                <Link href={`/minha-conta/pedidos/${orderDetails.id}`}>
                  <Button variant="outline" fullWidth className="justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Acompanhar Pedido
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Próximos Passos */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Próximos Passos
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Email de Confirmação
                    </p>
                    <p className="text-xs text-text-secondary">
                      Enviado para seu email cadastrado
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Preparação
                    </p>
                    <p className="text-xs text-text-secondary">
                      Seus produtos serão preparados em até 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Código de Rastreamento
                    </p>
                    <p className="text-xs text-text-secondary">
                      Enviado quando o produto sair para entrega
                    </p>
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
                <Button variant="outline" fullWidth>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mensagem de Agradecimento */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-2xl font-semibold text-text-primary mb-4">
            Muito Obrigado! 💚
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Sua confiança é muito importante para nós. Esperamos que você tenha
            uma experiência incrível com nossos produtos naturais. Se tiver
            alguma dúvida, nossa equipe está sempre pronta para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato">
              <Button variant="outline">Entre em Contato</Button>
            </Link>
            <Link href="/sobre">
              <Button variant="ghost">Conheça Nossa História</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
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
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}
