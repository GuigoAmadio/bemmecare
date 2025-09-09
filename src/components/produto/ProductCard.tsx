"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { clsx } from "clsx";
import { Product } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  showQuickAdd = true,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      addItem(product, 1);
      // TODO: Show success notification
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Card
      className={clsx(
        "h-[480px] w-full group relative overflow-hidden transition-all duration-300 hover:shadow-card",
        "cursor-pointer flex flex-col hover:bg-white/50 hover:translate-y-[-10px]",
        className
      )}
      padding="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/catalogo/produto/${product.id}`}
        className="flex flex-col h-full"
      >
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-background-secondary to-background flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                ⭐ Destaque
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-error to-warning text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-secondary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                Esgotado
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-warning/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                Últimas unidades
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleToggleFavorite}
              className={clsx(
                "p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg",
                "transition-all duration-200 hover:bg-white hover:scale-110",
                "border border-border/20",
                isFavorite
                  ? "text-error shadow-error/20"
                  : "text-text-muted hover:text-error"
              )}
            >
              <Heart
                className={clsx("h-4 w-4", isFavorite ? "fill-current" : "")}
              />
            </button>

            <button
              className={clsx(
                "p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg",
                "transition-all duration-200 hover:bg-white hover:scale-110",
                "border border-border/20 text-text-muted hover:text-primary"
              )}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Add Button */}
          {showQuickAdd && product.stock > 0 && (
            <div
              className={clsx(
                "absolute bottom-3 left-3 right-3 transition-all duration-300",
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              <Button
                onClick={handleAddToCart}
                loading={isLoading}
                fullWidth
                size="sm"
                variant="primary"
                className="bg-white/95 text-primary hover:bg-white hover:text-primary border-2 border-primary/20 backdrop-blur-sm shadow-lg font-semibold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {/* Top Section */}
          <div className="space-y-3">
            {/* Category */}
            <p className="text-xs text-primary font-medium uppercase tracking-wider">
              {product.category.name}
            </p>

            {/* Product Name */}
            <h3 className="font-semibold text-text-primary line-clamp-2 hover:text-primary transition-colors group-hover:text-primary leading-tight min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={clsx(
                        "h-3.5 w-3.5",
                        star <= product.rating
                          ? "text-warning fill-current"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-secondary font-medium">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="space-y-3 pt-2">
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-text-muted line-through">
                  R$ {product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Info */}
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-xs text-warning font-medium bg-warning/10 px-2 py-1 rounded-full inline-block">
                Apenas {product.stock} em estoque
              </p>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
