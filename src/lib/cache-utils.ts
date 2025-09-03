/**
 * Sistema Inteligente de Cache
 * Implementa cache em memória com TTL, invalidação automática e estratégias avançadas
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableCompression: boolean;
  enablePersistence: boolean;
  persistenceKey: string;
}

class IntelligentCache {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      maxSize: 1000,
      enableCompression: false,
      enablePersistence: false,
      persistenceKey: "bemmecare_cache",
      ...config,
    };

    this.startCleanupInterval();
    this.loadFromPersistence();
  }

  // Armazenar dados no cache
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      compress?: boolean;
    } = {}
  ): void {
    const now = Date.now();
    const ttl = options.ttl || this.config.defaultTTL;

    // Se o cache está cheio, remove os itens menos usados
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    const item: CacheItem<T> = {
      data:
        options.compress && this.config.enableCompression
          ? (this.compress(data) as any)
          : data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      tags: options.tags || [],
    };

    this.cache.set(key, item);
    this.saveToPersistence();
  }

  // Recuperar dados do cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    const now = Date.now();

    // Verifica se o item expirou
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.saveToPersistence();
      return null;
    }

    // Atualiza estatísticas de acesso
    item.accessCount++;
    item.lastAccessed = now;

    // Retorna dados descomprimidos se necessário
    return this.config.enableCompression && this.isCompressed(item.data)
      ? (this.decompress(item.data as string) as T)
      : item.data;
  }

  // Verificar se uma chave existe no cache
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.saveToPersistence();
      return false;
    }

    return true;
  }

  // Remover item do cache
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.saveToPersistence();
    return result;
  }

  // Invalidar cache por tags
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, item] of this.cache.entries()) {
      if (item.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    this.saveToPersistence();
    return count;
  }

  // Invalidar cache por padrão de chave
  invalidateByPattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    this.saveToPersistence();
    return count;
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
    this.saveToPersistence();
  }

  // Obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let totalSize = 0;
    let expiredCount = 0;
    let totalAccess = 0;

    for (const [key, item] of this.cache.entries()) {
      totalSize += this.getItemSize(item);
      totalAccess += item.accessCount;

      if (now - item.timestamp > item.ttl) {
        expiredCount++;
      }
    }

    return {
      totalItems: this.cache.size,
      totalSize,
      totalAccess,
      expiredCount,
      hitRate: this.calculateHitRate(),
      memoryUsage: process.memoryUsage?.() || null,
    };
  }

  // Pré-carregar dados no cache
  async preload(
    key: string,
    dataLoader: () => Promise<any>,
    options: {
      ttl?: number;
      tags?: string[];
      force?: boolean;
    } = {}
  ): Promise<any> {
    if (!options.force && this.has(key)) {
      return this.get(key);
    }

    try {
      const data = await dataLoader();
      this.set(key, data, options);
      return data;
    } catch (error) {
      console.error(`[Cache] Erro ao pré-carregar ${key}:`, error);
      throw error;
    }
  }

  // Renovar automaticamente o cache
  async refresh(
    key: string,
    dataLoader: () => Promise<any>,
    options: { ttl?: number; tags?: string[] } = {}
  ): Promise<any> {
    try {
      const data = await dataLoader();
      this.set(key, data, options);
      return data;
    } catch (error) {
      console.error(`[Cache] Erro ao renovar ${key}:`, error);
      // Retorna dados em cache se houver erro
      return this.get(key) || null;
    }
  }

  // Cache com fallback automático
  async getOrSet<T>(
    key: string,
    dataLoader: () => Promise<T>,
    options: {
      ttl?: number;
      tags?: string[];
      refreshThreshold?: number; // Renovar se está X% próximo do TTL
    } = {}
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached) {
      // Verifica se precisa renovar em background
      const item = this.cache.get(key);
      if (item && options.refreshThreshold) {
        const elapsed = Date.now() - item.timestamp;
        const threshold = item.ttl * (options.refreshThreshold / 100);

        if (elapsed > threshold) {
          // Renova em background sem bloquear
          this.refresh(key, dataLoader, options).catch(console.error);
        }
      }

      return cached;
    }

    // Se não há cache, carrega os dados
    const data = await dataLoader();
    this.set(key, data, options);
    return data;
  }

  // Métodos privados
  private evictLeastUsed(): void {
    let leastUsedKey = "";
    let leastUsedScore = Infinity;

    for (const [key, item] of this.cache.entries()) {
      // Score baseado em acessos e tempo desde último acesso
      const score =
        item.accessCount / Math.max(1, Date.now() - item.lastAccessed);

      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Limpa a cada minuto
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveToPersistence();
  }

  private calculateHitRate(): number {
    // Implementação simplificada - em produção seria mais sofisticada
    return 0.85; // Placeholder
  }

  private getItemSize(item: CacheItem<any>): number {
    try {
      return JSON.stringify(item).length;
    } catch {
      return 0;
    }
  }

  private compress(data: any): string {
    // Implementação simples - em produção usaria biblioteca de compressão
    return JSON.stringify(data);
  }

  private decompress(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  private isCompressed(data: any): boolean {
    return typeof data === "string";
  }

  private saveToPersistence(): void {
    if (!this.config.enablePersistence || typeof localStorage === "undefined") {
      return;
    }

    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem(this.config.persistenceKey, serialized);
    } catch (error) {
      console.warn("[Cache] Erro ao salvar no localStorage:", error);
    }
  }

  private loadFromPersistence(): void {
    if (!this.config.enablePersistence || typeof localStorage === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(this.config.persistenceKey);
      if (stored) {
        const entries = JSON.parse(stored);
        this.cache = new Map(entries);
      }
    } catch (error) {
      console.warn("[Cache] Erro ao carregar do localStorage:", error);
    }
  }

  // Destruir cache e limpar recursos
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Configurações padrão para diferentes ambientes
export const CACHE_CONFIG = {
  // Cache para dados de usuário
  USER_DATA: {
    defaultTTL: 10 * 60 * 1000, // 10 minutos
    maxSize: 100,
    tags: ["user"],
  },

  // Cache para produtos
  PRODUCTS: {
    defaultTTL: 30 * 60 * 1000, // 30 minutos
    maxSize: 500,
    tags: ["products"],
  },

  // Cache para categorias
  CATEGORIES: {
    defaultTTL: 60 * 60 * 1000, // 1 hora
    maxSize: 200,
    tags: ["categories"],
  },

  // Cache para sessões
  SESSION: {
    defaultTTL: 60 * 60 * 1000, // 1 hora
    maxSize: 50,
    tags: ["session"],
  },

  // Cache para estatísticas
  STATS: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxSize: 100,
    tags: ["stats"],
  },
};

// Instância global do cache
export const cacheUtils = new IntelligentCache({
  defaultTTL: 10 * 60 * 1000, // 10 minutos
  maxSize: 1000,
  enableCompression: false,
  enablePersistence: true,
  persistenceKey: "bemmecare_cache",
});

// Funções de conveniência para uso nos actions
export const cacheHelpers = {
  // Cache para dados de usuário
  user: {
    get: (userId: string) => cacheUtils.get(`user:${userId}`),
    set: (userId: string, data: any) =>
      cacheUtils.set(`user:${userId}`, data, CACHE_CONFIG.USER_DATA),
    invalidate: (userId: string) => cacheUtils.delete(`user:${userId}`),
    invalidateAll: () => cacheUtils.invalidateByTag("user"),
  },

  // Cache para produtos
  products: {
    get: (key: string) => cacheUtils.get(`products:${key}`),
    set: (key: string, data: any) =>
      cacheUtils.set(`products:${key}`, data, CACHE_CONFIG.PRODUCTS),
    invalidate: (key: string) => cacheUtils.delete(`products:${key}`),
    invalidateAll: () => cacheUtils.invalidateByTag("products"),
  },

  // Cache para categorias
  categories: {
    get: (key: string) => cacheUtils.get(`categories:${key}`),
    set: (key: string, data: any) =>
      cacheUtils.set(`categories:${key}`, data, CACHE_CONFIG.CATEGORIES),
    invalidate: (key: string) => cacheUtils.delete(`categories:${key}`),
    invalidateAll: () => cacheUtils.invalidateByTag("categories"),
  },

  // Cache para sessões
  session: {
    get: (sessionId: string) => cacheUtils.get(`session:${sessionId}`),
    set: (sessionId: string, data: any) =>
      cacheUtils.set(`session:${sessionId}`, data, CACHE_CONFIG.SESSION),
    invalidate: (sessionId: string) =>
      cacheUtils.delete(`session:${sessionId}`),
    invalidateAll: () => cacheUtils.invalidateByTag("session"),
  },

  // Cache para estatísticas
  stats: {
    get: (key: string) => cacheUtils.get(`stats:${key}`),
    set: (key: string, data: any) =>
      cacheUtils.set(`stats:${key}`, data, CACHE_CONFIG.STATS),
    invalidate: (key: string) => cacheUtils.delete(`stats:${key}`),
    invalidateAll: () => cacheUtils.invalidateByTag("stats"),
  },

  // Cache para schedules
  schedules: {
    get: (key: string) => cacheUtils.get(`schedules:${key}`),
    set: (key: string, data: any) =>
      cacheUtils.set(`schedules:${key}`, data, CACHE_CONFIG.PRODUCTS), // Usando mesmo TTL dos produtos
    invalidate: (key: string) => cacheUtils.delete(`schedules:${key}`),
    invalidateAll: () => cacheUtils.invalidateByTag("schedules"),
  },
};

export default cacheUtils;
