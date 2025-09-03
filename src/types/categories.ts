export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;

  // Hierarquia
  parentId?: string;
  parent?: Category;
  children?: Category[];
  level: number;
  path: string; // exemplo: "electronics/smartphones"

  // Configurações
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  // Estatísticas
  productCount: number;

  // Datas
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilter {
  parentId?: string;
  level?: number;
  isActive?: boolean;
  isVisible?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "name" | "sortOrder" | "productCount" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CategorySearchResult {
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  isVisible: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  children: CategoryTree[];
  productCount: number;
  isActive: boolean;
}
