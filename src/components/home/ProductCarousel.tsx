"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/produto/ProductCard";
import Button from "@/components/ui/Button";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  showViewAll = true,
  viewAllHref = "/catalogo",
  className = "",
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerView = 4; // Desktop: 4, Tablet: 2, Mobile: 1
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.clientWidth || 0;
      const gap = 24; // gap-6 = 24px
      const scrollPosition = index * (itemWidth + gap);

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mx-20">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 font-heading">
              {title}
            </h2>
            {subtitle && (
              <p className="text-text-secondary text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && (
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Ver Todos
            </Button>
          )}
        </div>

        {/* Carousel */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden py-4">
          {/* Navigation Buttons */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronLeft className="h-6 w-6 text-text-primary group-hover:text-primary transition-colors mx-auto" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronRight className="h-6 w-6 text-text-primary group-hover:text-primary transition-colors mx-auto" />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            className="flex w-full py-10 max-w-7xl mx-auto gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start z-30 "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {products.length > itemsPerView && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
