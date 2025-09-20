"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      // TODO: Implementar lógica do cupom
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/catalogo"
              className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">
              Carrinho de Compras
            </h1>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-text-muted" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-text-secondary mb-8">
                Adicione alguns produtos ao seu carrinho para continuar com a
                compra.
              </p>
              <Link href="/catalogo">
                <Button size="lg" variant="primary">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">
              Carrinho de Compras ({cart.itemCount}{" "}
              {cart.itemCount === 1 ? "item" : "itens"})
            </h1>
            <button
              onClick={clearCart}
              className="text-text-secondary hover:text-error transition-colors text-sm"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-6">
                  {/* Imagem do Produto */}
                  <div className="relative w-24 h-24 bg-background-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                          {item.product.category.name}
                        </p>
                        <Link
                          href={`/catalogo/produto/${item.product.id}`}
                          className="text-text-primary font-semibold hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-text-secondary text-sm">
                          {item.product.brand}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-text-muted hover:text-error transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Controles de Quantidade */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-text-primary font-semibold border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 text-text-muted hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Preço */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          R$ {item.product.price.toFixed(2)} cada
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            {/* Cupom de Desconto */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Cupom de Desconto
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Digite seu cupom"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  onClick={handleApplyCoupon}
                  loading={isApplyingCoupon}
                  variant="outline"
                  className="px-6"
                >
                  Aplicar
                </Button>
              </div>
            </Card>

            {/* Resumo dos Valores */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Resumo do Pedido
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>
                    Subtotal ({cart.itemCount}{" "}
                    {cart.itemCount === 1 ? "item" : "itens"})
                  </span>
                  <span>R$ {cart.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Frete</span>
                  <span>
                    {cart.shipping === 0 ? (
                      <span className="text-success font-semibold">Grátis</span>
                    ) : (
                      `R$ ${cart.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Desconto</span>
                    <span>-R$ {cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <hr className="border-border" />

                <div className="flex justify-between text-lg font-bold text-text-primary">
                  <span>Total</span>
                  <span>R$ {cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/checkout">
                  <Button
                    size="lg"
                    variant="primary"
                    fullWidth
                    className="bg-gradient-to-r from-primary to-primary-light"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Finalizar Compra
                  </Button>
                </Link>

                <Link href="/catalogo">
                  <Button size="lg" variant="outline" fullWidth>
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Informações de Segurança */}
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Compra Segura
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Pagamento Seguro
                    </p>
                    <p className="text-xs text-text-secondary">SSL 256 bits</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Frete Grátis
                    </p>
                    <p className="text-xs text-text-secondary">
                      Acima de R$ 100
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
