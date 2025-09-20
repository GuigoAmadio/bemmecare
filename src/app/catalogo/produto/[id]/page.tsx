"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProductCarousel from "@/components/home/ProductCarousel";
import { useCart } from "@/context/CartContext";

// Mock data - em produção viria da API
const mockProducts = [
  {
    id: "1",
    name: "Óleo Essencial de Lavanda",
    description:
      "Óleo essencial puro de lavanda, perfeito para relaxamento e aromaterapia. Este produto é extraído através de destilação a vapor das flores de lavanda francesa, garantindo a mais alta qualidade e pureza. Ideal para uso em difusores, massagens relaxantes, banhos aromáticos e cuidados com a pele.",
    price: 45.9,
    oldPrice: 59.9,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center&sat=-100",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center&hue=30",
    ],
    category: {
      id: "1",
      name: "Óleos Essenciais",
      slug: "oleos-essenciais",
      description: "Óleos essenciais puros",
      image: "",
      level: 1,
      path: "oleos-essenciais",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 1,
      productCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    isFeatured: true,
    features: [
      "100% Natural e Puro",
      "Extraído por Destilação a Vapor",
      "Ideal para Aromaterapia",
      "Certificado Orgânico",
      "Livre de Aditivos Químicos",
    ],
    specifications: {
      Volume: "10ml",
      Origem: "França",
      "Tipo de pele": "Todas",
      Tipo: "Essencial",
      Peso: "10g",
      Uso: "Aromaterapia",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produtos similares para o carrossel
  {
    id: "2",
    name: "Óleo Essencial de Eucalipto",
    description: "Óleo essencial de eucalipto para alívio respiratório",
    price: 38.9,
    oldPrice: 48.9,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "1",
      name: "Óleos Essenciais",
      slug: "oleos-essenciais",
      description: "Óleos essenciais puros",
      image: "",
      level: 1,
      path: "oleos-essenciais",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 1,
      productCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.6,
    reviewCount: 89,
    stock: 8,
    isFeatured: false,
    features: ["Alívio respiratório", "100% Natural", "Refrescante"],
    specifications: {
      Volume: "10ml",
      Origem: "Austrália",
      "Tipo de pele": "Todas",
      Tipo: "Essencial",
      Peso: "10g",
      Uso: "Aromaterapia",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Óleo Essencial de Tea Tree",
    description: "Óleo essencial de tea tree com propriedades antissépticas",
    price: 42.5,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "1",
      name: "Óleos Essenciais",
      slug: "oleos-essenciais",
      description: "Óleos essenciais puros",
      image: "",
      level: 1,
      path: "oleos-essenciais",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 1,
      productCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.7,
    reviewCount: 156,
    stock: 12,
    isFeatured: true,
    features: ["Antisséptico", "100% Natural", "Para pele"],
    specifications: {
      Volume: "10ml",
      Origem: "Austrália",
      "Tipo de pele": "Todas",
      Tipo: "Essencial",
      Peso: "10g",
      Uso: "Tópico",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");

  useEffect(() => {
    // Simular busca do produto
    const foundProduct = mockProducts.find((p) => p.id === productId);
    setProduct(foundProduct || null);

    // Verificar se está nos favoritos (localStorage)
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsLoading(true);
    try {
      addItem(product, quantity);
      // TODO: Mostrar notificação de sucesso
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const discountPercentage = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const similarProducts = mockProducts.filter(
    (p) => p.id !== productId && p.category.id === product?.category.id
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Produto não encontrado
          </h1>
          <Link href="/catalogo">
            <Button variant="primary">Voltar ao Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-background-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-text-secondary">
            <Link href="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link
              href="/catalogo"
              className="hover:text-primary transition-colors"
            >
              Catálogo
            </Link>
            <span>/</span>
            <Link
              href={`/catalogo?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-background-secondary rounded-2xl overflow-hidden group">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Destaque
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-gradient-to-r from-error to-warning text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Navegação das imagens */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-text-primary mx-auto" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 text-text-primary mx-auto" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-semibold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                  {product.category.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full border transition-all duration-300 ${
                      isFavorite
                        ? "bg-error/10 border-error text-error"
                        : "bg-background-secondary border-border text-text-muted hover:text-error hover:border-error"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button className="p-2 rounded-full bg-background-secondary border border-border text-text-muted hover:text-primary hover:border-primary transition-all duration-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.rating
                            ? "text-warning fill-current"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-text-primary font-semibold">
                    {product.rating}
                  </span>
                  <span className="text-text-secondary">
                    ({product.reviewCount} avaliações)
                  </span>
                </div>
              </div>
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-text-muted line-through">
                    R$ {product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-success font-semibold">
                  Você economiza R${" "}
                  {(product.oldPrice! - product.price).toFixed(2)} (
                  {discountPercentage}%)
                </p>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary">
                Características Principais:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-success font-medium">Em estoque</span>
                  {product.stock <= 10 && (
                    <span className="text-warning text-sm">
                      (apenas {product.stock} unidades restantes)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-error font-medium">
                    Fora de estoque
                  </span>
                </div>
              )}
            </div>

            {/* Quantidade e Compra */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-text-primary font-medium">
                  Quantidade:
                </span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-text-muted hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 text-text-primary font-semibold border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="p-3 text-text-muted hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isLoading}
                  loading={isLoading}
                  size="lg"
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-primary to-primary-light"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="border-2"
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Garantias */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Produto Original
                  </p>
                  <p className="text-xs text-text-secondary">100% Autêntico</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Frete Grátis
                  </p>
                  <p className="text-xs text-text-secondary">Acima de R$ 100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Troca Garantida
                  </p>
                  <p className="text-xs text-text-secondary">Em até 30 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Informações */}
        <div className="mt-16">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {[
                { id: "description", label: "Descrição" },
                { id: "specifications", label: "Especificações" },
                { id: "reviews", label: "Avaliações" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-border"
                  >
                    <span className="font-medium text-text-primary">
                      {key}:
                    </span>
                    <span className="text-text-secondary">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  Sistema de avaliações em desenvolvimento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Produtos Similares */}
      {similarProducts.length > 0 && (
        <ProductCarousel
          title="Produtos Similares"
          subtitle="Outros produtos que você pode gostar"
          products={similarProducts}
          showViewAll={true}
          viewAllHref={`/catalogo?category=${product.category.slug}`}
          className="bg-background-secondary"
        />
      )}
    </div>
  );
}
