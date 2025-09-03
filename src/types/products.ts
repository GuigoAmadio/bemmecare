import type { Category } from "./categories";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: Category;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category moved to categories.ts to avoid conflicts

export interface ProductVariant {
  id: string;
  name: string;
  type: "color" | "size" | "style" | "material";
  value: string;
  priceModifier: number;
  stock: number;
  image?: string;
}

export interface ProductFilter {
  category?: string;
  categories?: string[];
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
  sortBy?: "name" | "price" | "rating" | "newest" | "popularity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    categories: Category[];
    brands: string[];
    priceRange: { min: number; max: number };
    availableFilters: ProductFilter;
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}
