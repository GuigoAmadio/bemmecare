"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types";

interface CartDropdownProps {
  className?: string;
}

export default function CartDropdown({ className = "" }: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cart, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-primary/10 hover:text-primary group"
      >
        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
        {cart.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-error to-warning text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {cart.itemCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-border/10 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Meu Carrinho
              </h3>
              <span className="text-sm text-text-secondary">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="max-h-80 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-text-muted mb-2">Seu carrinho está vazio</p>
                <p className="text-sm text-text-muted">Adicione produtos para continuar</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-background-secondary/30 rounded-xl hover:bg-background-secondary/50 transition-colors">
                    {/* Imagem */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary text-sm line-clamp-1 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-text-muted mb-2">
                        {item.product.category.name}
                      </p>

                      {/* Quantidade e Preço */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-md overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="p-1 hover:bg-background-secondary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 py-1 text-xs font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:bg-background-secondary transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-primary text-sm">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-text-muted">
                              R$ {item.product.price.toFixed(2)} cada
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-text-muted hover:text-error transition-colors self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t border-border bg-background-secondary/30">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-text-primary">Subtotal:</span>
                <span className="font-bold text-xl text-primary">
                  R$ {cart.subtotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping Info */}
              {cart.subtotal < 100 && (
                <div className="text-xs text-text-muted mb-4 p-2 bg-warning/10 rounded-lg">
                  💡 Adicione R$ {(100 - cart.subtotal).toFixed(2)} para frete grátis!
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/carrinho" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth className="font-medium">
                    Ver Carrinho Completo
                  </Button>
                </Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" fullWidth className="bg-gradient-to-r from-primary to-accent font-semibold">
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
