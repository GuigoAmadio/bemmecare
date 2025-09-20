"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { Product } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProductCard from "@/components/produto/ProductCard";

// Mock data - em produção viria da API
const mockProducts = [
  {
    id: "1",
    name: "Óleo Essencial de Lavanda",
    description:
      "Óleo essencial puro de lavanda, perfeito para relaxamento e aromaterapia",
    price: 45.9,
    oldPrice: 59.9,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&crop=center",
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
    features: ["100% Natural", "Aromaterapia", "Relaxamento"],
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
  {
    id: "2",
    name: "Creme Hidratante Natural",
    description:
      "Creme hidratante com ingredientes naturais para todos os tipos de pele",
    price: 32.5,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "2",
      name: "Cuidados com a Pele",
      slug: "cuidados-pele",
      description: "Produtos para cuidados com a pele",
      image: "",
      level: 1,
      path: "cuidados-pele",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 2,
      productCount: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.6,
    reviewCount: 89,
    stock: 8,
    isFeatured: false,
    features: [
      "Hidratação profunda",
      "Ingredientes naturais",
      "Para todos os tipos de pele",
    ],
    specifications: {
      Volume: "50ml",
      "Tipo de pele": "Todas",
      Origem: "Brasil",
      Tipo: "Hidratante",
      Peso: "50g",
      Uso: "Facial",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Shampoo Orgânico",
    description: "Shampoo orgânico para cabelos saudáveis e brilhantes",
    price: 28.9,
    oldPrice: 35.9,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "3",
      name: "Cabelos",
      slug: "cabelos",
      description: "Produtos para cabelos",
      image: "",
      level: 1,
      path: "cabelos",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 3,
      productCount: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.7,
    reviewCount: 156,
    stock: 12,
    isFeatured: true,
    features: ["Orgânico", "Sem sulfatos", "Para todos os tipos de cabelo"],
    specifications: {
      Volume: "300ml",
      Tipo: "Orgânico",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Peso: "300g",
      Uso: "Capilar",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Sabonete Artesanal",
    description:
      "Sabonete artesanal com ingredientes naturais e essências suaves",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1556228453-5b3bbaa7b5c3?w=300&h=300&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556228453-5b3bbaa7b5c3?w=300&h=300&fit=crop&crop=center",
    ],
    category: {
      id: "4",
      name: "Higiene",
      slug: "higiene",
      description: "Produtos de higiene",
      image: "",
      level: 1,
      path: "higiene",
      isActive: true,
      isVisible: true,
      isFeatured: true,
      sortOrder: 4,
      productCount: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: "BemmeCare",
    rating: 4.9,
    reviewCount: 203,
    stock: 25,
    isFeatured: false,
    features: ["Artesanal", "Ingredientes naturais", "Essências suaves"],
    specifications: {
      Peso: "100g",
      Tipo: "Artesanal",
      Origem: "Brasil",
      "Tipo de pele": "Todas",
      Volume: "100g",
      Uso: "Corporal",
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavoriteIds(savedFavorites);

    // Filtrar produtos favoritos
    const favorites = mockProducts.filter((product) =>
      savedFavorites.includes(product.id)
    );
    setFavoriteProducts(favorites);
  }, []);

  const removeFromFavorites = (productId: string) => {
    const newFavorites = favoriteIds.filter((id) => id !== productId);
    setFavoriteIds(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    const newFavoriteProducts = favoriteProducts.filter(
      (product) => product.id !== productId
    );
    setFavoriteProducts(newFavoriteProducts);
  };

  const clearAllFavorites = () => {
    setFavoriteIds([]);
    setFavoriteProducts([]);
    localStorage.removeItem("favorites");
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">
              Meus Favoritos
            </h1>
          </div>

          {/* Empty Favorites */}
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-text-muted" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Você ainda não tem favoritos
              </h2>
              <p className="text-text-secondary mb-8">
                Adicione produtos aos seus favoritos clicando no ícone de
                coração para encontrá-los facilmente depois.
              </p>
              <Link href="/catalogo">
                <Button size="lg" variant="primary">
                  <ShoppingCart className="mr-2 h-5 w-5" />
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
            href="/"
            className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Meus Favoritos
              </h1>
              <p className="text-text-secondary">
                {favoriteProducts.length}{" "}
                {favoriteProducts.length === 1
                  ? "produto favoritado"
                  : "produtos favoritados"}
              </p>
            </div>
            {favoriteProducts.length > 0 && (
              <Button
                onClick={clearAllFavorites}
                variant="outline"
                className="text-error border-error hover:bg-error hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Favoritos
              </Button>
            )}
          </div>
        </div>

        {/* Filtros e Ordenação */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Todos ({favoriteProducts.length})
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Óleos Essenciais (
                {
                  favoriteProducts.filter(
                    (p) => p.category.slug === "oleos-essenciais"
                  ).length
                }
                )
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Cuidados com a Pele (
                {
                  favoriteProducts.filter(
                    (p) => p.category.slug === "cuidados-pele"
                  ).length
                }
                )
              </Button>
            </div>
            <select className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Ordenar por: Mais Recente</option>
              <option>Menor Preço</option>
              <option>Maior Preço</option>
              <option>Melhor Avaliado</option>
            </select>
          </div>
        </Card>

        {/* Grid de Produtos Favoritos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />

              {/* Botão para Remover dos Favoritos */}
              <button
                onClick={() => removeFromFavorites(product.id)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/20 text-error hover:bg-error hover:text-white transition-all duration-300 z-10"
                title="Remover dos favoritos"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Gostou dos seus favoritos?
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Continue explorando nossa coleção de produtos naturais e encontre
            ainda mais itens que você vai amar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo">
              <Button size="lg" variant="primary">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Continuar Comprando
              </Button>
            </Link>
            <Link href="/carrinho">
              <Button size="lg" variant="outline">
                Ver Carrinho
              </Button>
            </Link>
          </div>
        </Card>

        {/* Dicas sobre Favoritos */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-text-primary mb-2">
              Salve seus Favoritos
            </h4>
            <p className="text-text-secondary text-sm">
              Clique no coração para adicionar produtos aos seus favoritos e
              encontrá-los facilmente.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-text-primary mb-2">
              Compra Rápida
            </h4>
            <p className="text-text-secondary text-sm">
              Adicione seus produtos favoritos ao carrinho com apenas um clique.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-text-primary mb-2">
              Organize sua Lista
            </h4>
            <p className="text-text-secondary text-sm">
              Remova produtos que não interessam mais para manter sua lista
              organizada.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
