"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import { Product } from "@/types";
import { getProducts } from "@/actions/products";
import { cacheHelpers } from "@/lib/cache-utils";

interface ProductsSectionProps {
  onBack: () => void;
}

export default function ProductsSection({ onBack }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      // Primeiro, tenta buscar do cache
      const cachedProducts = cacheHelpers.products.get("all") as
        | Product[]
        | null;

      if (cachedProducts) {
        console.log("📦 Produtos carregados do cache");
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      // Se não estiver no cache, busca do backend
      console.log("🌐 Buscando produtos do backend");
      const fetchedProducts = await getProducts();

      if (fetchedProducts) {
        setProducts(fetchedProducts);
        // Os dados já são salvos no cache pela função getProducts
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && product.isActive) ||
      (filterStatus === "inactive" && !product.isActive);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-text-muted">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Produtos</h1>
            <p className="text-text-muted">Gerencie seu catálogo de produtos</p>
          </div>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all group hover:transform hover:scale-105"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-text-muted" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-text-muted text-sm mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-text-muted">
                  Estoque: {product.stock}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <Edit className="h-3 w-3" />
                  <span className="text-sm">Editar</span>
                </button>
                <button className="px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-text-muted mb-4">
            {searchTerm || filterStatus !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro produto"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all">
              Adicionar Produto
            </button>
          )}
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-2xl font-bold text-slate-700">
              {products.length}
            </div>
            <div className="text-sm text-slate-600">Total de Produtos</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">
              {products.filter((p) => p.isActive).length}
            </div>
            <div className="text-sm text-emerald-600">Produtos Ativos</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-2xl font-bold text-red-700">
              {products.filter((p) => !p.isActive).length}
            </div>
            <div className="text-sm text-red-600">Produtos Inativos</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="text-2xl font-bold text-amber-700">
              {products.filter((p) => p.stock < 10).length}
            </div>
            <div className="text-sm text-amber-600">Estoque Baixo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
