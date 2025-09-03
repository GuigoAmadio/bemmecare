# 🚀 Sistema Inteligente de Cache - BemmeCare

## 📋 Visão Geral

Este sistema implementa um cache inteligente em memória com recursos avançados como TTL automático, invalidação por tags, estratégias de eviction e persistência opcional.

## 🏗️ Arquitetura

### Core Classes

- **`IntelligentCache`**: Classe principal do cache
- **`cacheHelpers`**: Helpers específicos por domínio
- **`CACHE_CONFIG`**: Configurações pré-definidas

### Estrutura de Dados

```typescript
interface CacheItem<T> {
  data: T; // Dados armazenados
  timestamp: number; // Quando foi armazenado
  ttl: number; // Time to live em ms
  accessCount: number; // Quantas vezes foi acessado
  lastAccessed: number; // Último acesso
  tags: string[]; // Tags para invalidação
}
```

## 🔧 Funcionalidades Principais

### 1. TTL Automático

- Expiração automática de dados
- Cleanup periódico (a cada minuto)
- TTL configurável por item

### 2. Invalidação Inteligente

- **Por chave específica**: `cache.delete(key)`
- **Por tags**: `cache.invalidateByTag('products')`
- **Por padrão regex**: `cache.invalidateByPattern(/^user:/)`

### 3. Estratégias de Eviction

- **LRU**: Remove itens menos utilizados
- **Baseado em score**: Considera frequência + recência
- Limite máximo configurável

### 4. Persistência Opcional

- Salva no localStorage automaticamente
- Recupera dados ao inicializar
- Configurável via `enablePersistence`

## 📦 Como Usar

### Uso Básico

```typescript
import { cacheUtils } from "@/lib/cache-utils";

// Armazenar
cacheUtils.set("user:123", userData, {
  ttl: 10 * 60 * 1000, // 10 minutos
  tags: ["user"],
});

// Recuperar
const user = cacheUtils.get("user:123");

// Verificar existência
if (cacheUtils.has("user:123")) {
  // ...
}
```

### Uso com Helpers

```typescript
import { cacheHelpers } from "@/lib/cache-utils";

// Cache de produtos
cacheHelpers.products.set("all", productsArray);
const products = cacheHelpers.products.get("all");
cacheHelpers.products.invalidateAll();

// Cache de usuário
cacheHelpers.user.set("123", userData);
const user = cacheHelpers.user.get("123");
```

### Cache com Fallback Automático

```typescript
const products = await cacheUtils.getOrSet(
  "products:all",
  async () => {
    const response = await serverGet<Product[]>("/products");
    return response.data;
  },
  {
    ttl: 30 * 60 * 1000, // 30 minutos
    tags: ["products"],
    refreshThreshold: 80, // Renova quando 80% do TTL passou
  }
);
```

## ⚙️ Configurações

### Configuração Global

```typescript
const cache = new IntelligentCache({
  defaultTTL: 10 * 60 * 1000, // TTL padrão: 10 min
  maxSize: 1000, // Máximo 1000 itens
  enableCompression: false, // Compressão desabilitada
  enablePersistence: true, // Persistência habilitada
  persistenceKey: "app_cache", // Chave do localStorage
});
```

### Configurações por Domínio

```typescript
// Produtos - cache longo
CACHE_CONFIG.PRODUCTS = {
  defaultTTL: 30 * 60 * 1000, // 30 minutos
  maxSize: 500,
  tags: ["products"],
};

// Usuário - cache médio
CACHE_CONFIG.USER_DATA = {
  defaultTTL: 10 * 60 * 1000, // 10 minutos
  maxSize: 100,
  tags: ["user"],
};

// Estatísticas - cache curto
CACHE_CONFIG.STATS = {
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 100,
  tags: ["stats"],
};
```

## 🎯 Padrões de Uso nos Actions

### 1. Cache de Leitura com Invalidação

```typescript
export async function getProducts(): Promise<Product[] | undefined> {
  try {
    // Verifica cache primeiro
    const cached = cacheHelpers.products.get("all") as Product[] | null;
    if (cached) {
      log("[getProducts] Cache hit");
      return cached;
    }

    // Busca na API
    const response = await serverGet<Product[]>("/products");

    // Armazena no cache
    if (response.data) {
      cacheHelpers.products.set("all", response.data);
    }

    return response.data;
  } catch (error) {
    handleError("getProducts", error);
  }
}
```

### 2. Invalidação após Modificação

```typescript
export async function createProduct(
  product: CreateProductData
): Promise<Product | undefined> {
  try {
    const response = await serverPost<Product>("/products", product);

    // Invalida cache após criação bem-sucedida
    if (response.data) {
      cacheHelpers.products.invalidateAll();
      log("[createProduct] Cache invalidated");
    }

    return response.data;
  } catch (error) {
    handleError("createProduct", error);
  }
}
```

### 3. Cache Individual + Cache de Lista

```typescript
export async function updateProduct(
  id: string,
  data: UpdateData
): Promise<Product | undefined> {
  try {
    const response = await serverPatch<Product>(`/products/${id}`, data);

    // Invalida cache específico E cache geral
    if (response.data) {
      cacheHelpers.products.invalidate(id); // Cache individual
      cacheHelpers.products.invalidate("all"); // Cache da lista
      log("[updateProduct] Cache invalidated for product:", id);
    }

    return response.data;
  } catch (error) {
    handleError("updateProduct", error);
  }
}
```

## 📊 Monitoramento

### Estatísticas do Cache

```typescript
const stats = cacheUtils.getStats();
console.log("Cache Stats:", {
  totalItems: stats.totalItems,
  totalSize: stats.totalSize,
  hitRate: stats.hitRate,
  expiredCount: stats.expiredCount,
});
```

### Limpeza Manual

```typescript
// Limpar tudo
cacheUtils.clear();

// Limpar por tag
cacheUtils.invalidateByTag("products");

// Limpar por padrão
cacheUtils.invalidateByPattern(/^user:/);
```

## 🔮 Funcionalidades Futuras

### 1. Cache Distribuído

- Redis como backend
- Sincronização entre instâncias
- Fallback para cache local

### 2. Analytics Avançados

- Métricas de hit/miss rate
- Tempo médio de acesso
- Identificação de hot keys

### 3. Estratégias Avançadas

- Preloading inteligente
- Refresh automático baseado em padrões
- Cache warming strategies

### 4. Compressão Inteligente

- Compressão automática para objetos grandes
- Algoritmos otimizados (LZ4, Brotli)
- Threshold configurável

### 5. Persistência Avançada

- IndexedDB para grandes volumes
- Sync com servidor
- Offline-first strategies

## 🚨 Considerações Importantes

### Performance

- Cache em memória = acesso muito rápido
- Limpeza automática previne memory leaks
- Eviction inteligente mantém itens importantes

### Memory Management

- Limite máximo configurável
- Cleanup periódico automático
- Monitoramento de uso de memória

### Segurança

- Não cache dados sensíveis
- TTL adequado para diferentes tipos de dados
- Invalidação imediata quando necessário

### Debugging

- Logs detalhados em desenvolvimento
- Estatísticas para monitoramento
- Cache inspection tools

---

## 📚 Referências e Próximos Passos

1. **Implementar cache distribuído com Redis**
2. **Adicionar métricas avançadas**
3. **Implementar preloading inteligente**
4. **Otimizar estratégias de invalidação**
5. **Adicionar testes de performance**

Este sistema é a base para um cache enterprise-ready e pode ser expandido conforme as necessidades do projeto evoluem.

