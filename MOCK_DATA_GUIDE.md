# 📅 Guia de Dados Mockup - Sistema de Agenda

Este guia explica como usar os dados mockup criados para testar todas as funcionalidades do sistema de agenda.

## 📁 Arquivos Criados

### 1. `src/data/mockSchedules.json`

Arquivo JSON com 15 schedules de exemplo cobrindo todas as funcionalidades:

- **Diferentes Status**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED
- **Várias Categorias**: WORK, PERSONAL, MEETING, APPOINTMENT, REMINDER, OTHER
- **Prioridades Diversas**: LOW, MEDIUM, HIGH, URGENT
- **Tipos de Tasks**: Dia inteiro, com horário específico, recorrentes
- **Lembretes**: Configurados em diferentes intervalos
- **Anexos**: URLs de exemplo para documentos
- **Visibilidade**: Tasks públicas e privadas

### 2. `src/hooks/useMockSchedules.ts`

Hook React personalizado para gerenciar os dados mockup com:

- **Carregamento automático** dos dados
- **CRUD operations** para adicionar, editar e deletar
- **Funções de filtro** por data, status, categoria
- **Busca de texto** em título e descrição
- **Queries específicas** (hoje, próximos dias, atrasados)
- **Gerador de dados** aleatórios

### 3. `src/components/dashboard/Calendar/MockDataDemo.tsx`

Componente de demonstração com interface visual para:

- **Carregar dados** no calendário
- **Adicionar schedules** aleatórios
- **Ver estatísticas** detalhadas
- **Exportar dados** em JSON
- **Recarregar** dados originais

## 🚀 Como Usar

### Método 1: Usando o Hook useMockSchedules

```typescript
import { useMockSchedules } from "@/hooks/useMockSchedules";

function MeuComponente() {
  const {
    schedules,
    loading,
    addMockSchedule,
    updateMockSchedule,
    deleteMockSchedule,
    searchSchedules,
    getTodaySchedules,
  } = useMockSchedules();

  // Usar os schedules no seu componente
  return (
    <div>
      {schedules.map((schedule) => (
        <div key={schedule.id}>{schedule.title}</div>
      ))}
    </div>
  );
}
```

### Método 2: Carregamento Direto

```typescript
import mockData from "@/data/mockSchedules.json";

// Acessar os dados diretamente
const schedules = mockData.schedules;
const statistics = mockData.statistics;
```

### Método 3: Componente de Demo

```typescript
import MockDataDemo from "@/components/dashboard/Calendar/MockDataDemo";

function MinhaPageDeTeste() {
  const handleDataLoaded = (schedules) => {
    // Usar os schedules carregados
    console.log("Schedules carregados:", schedules);
  };

  return <MockDataDemo onDataLoaded={handleDataLoaded} />;
}
```

## 📊 Estrutura dos Dados

### Schedule Interface

```typescript
interface Schedule {
  id: string;
  clientId: string;
  userId: string;
  employeeId?: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  tasks: Task[];
  status: ScheduleStatus;
  priority: SchedulePriority;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  allDay: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  color?: string;
  category: ScheduleCategory;
  reminders: Reminder[];
  attachments: string[];
  isPublic: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Exemplos de Dados Inclusos

1. **Consulta Médica** (APPOINTMENT, HIGH priority)

   - Data: 15/01/2024, 14:30-15:30
   - Lembretes: 60min e 15min antes
   - Tasks: Levar exames, trazer carteirinha

2. **Reunião de Projeto** (MEETING, MEDIUM priority)

   - Recorrente: Toda terça-feira
   - Anexos: Apresentação PDF
   - Pública

3. **Aniversário** (PERSONAL, LOW priority)

   - Dia inteiro
   - Lembrete: 1 dia antes
   - Privada

4. **Entrega de Projeto** (WORK, URGENT priority)
   - Status: COMPLETED
   - Múltiplos anexos
   - Tasks complexas

## 🧪 Cenários de Teste

### 1. Teste de Filtros

```typescript
const { getSchedulesByStatus, getSchedulesByCategory, searchSchedules } =
  useMockSchedules();

// Testar filtros
const pendingTasks = getSchedulesByStatus("PENDING");
const workTasks = getSchedulesByCategory("WORK");
const searchResults = searchSchedules("reunião");
```

### 2. Teste de Drag & Drop

Os dados incluem schedules em diferentes datas para testar:

- Arrastar entre dias
- Manter horários ao mover
- Atualizar data automaticamente

### 3. Teste de Notificações

Schedules com diferentes configurações de lembretes:

- Lembretes em minutos (15, 30, 60, 120, 1440)
- Tipos: notification, email
- Tasks atrasadas para testar alertas

### 4. Teste de Busca Global

Termos de busca sugeridos:

- "reunião" - encontra reuniões
- "consulta" - encontra appointments
- "projeto" - encontra tasks de trabalho
- "aniversário" - encontra eventos pessoais

### 5. Teste de Vista Semanal

Os dados cobrem várias semanas para testar:

- Navegação entre semanas
- Visualização por horários
- Tasks de dia inteiro vs com horário

## 📈 Estatísticas Incluídas

```json
{
  "total": 15,
  "byStatus": {
    "PENDING": 8,
    "IN_PROGRESS": 2,
    "COMPLETED": 3,
    "CANCELLED": 1,
    "POSTPONED": 1
  },
  "byCategory": {
    "WORK": 5,
    "PERSONAL": 3,
    "MEETING": 3,
    "APPOINTMENT": 2,
    "REMINDER": 2,
    "OTHER": 1
  },
  "byPriority": {
    "LOW": 2,
    "MEDIUM": 5,
    "HIGH": 5,
    "URGENT": 3
  }
}
```

## 🔧 Personalizando os Dados

### Adicionando Novos Schedules

```typescript
const { addMockSchedule, generateMockSchedule } = useMockSchedules();

// Adicionar schedule específico
addMockSchedule({
  title: "Minha Task Customizada",
  date: "2024-01-30",
  category: "WORK",
  priority: "HIGH",
  // ... outros campos
});

// Ou gerar aleatório
const randomSchedule = generateMockSchedule({
  category: "PERSONAL", // sobrescrever campos específicos
});
addMockSchedule(randomSchedule);
```

### Modificando Dados Existentes

```typescript
const { updateMockSchedule } = useMockSchedules();

updateMockSchedule("schedule-id", {
  status: "COMPLETED",
  completedAt: new Date().toISOString(),
});
```

## 🎯 Casos de Uso Específicos

### Para Testar Lembretes

Use os schedules IDs: 1, 2, 5, 6, 8, 14, 15 que têm lembretes configurados.

### Para Testar Drag & Drop

Use schedules próximos como IDs: 1, 2, 3 que estão em dias consecutivos.

### Para Testar Tasks Atrasadas

Modifique as datas dos schedules para dias passados e status não-completed.

### Para Testar Recorrência

Schedules IDs: 2, 9, 11, 12 têm padrões de recorrência configurados.

## 📝 Notas Importantes

1. **Datas**: Todas as datas estão em Janeiro de 2024. Ajuste conforme necessário.

2. **IDs**: Use IDs únicos ao adicionar novos schedules para evitar conflitos.

3. **Performance**: Os dados são carregados em memória. Para grandes volumes, considere paginação.

4. **Persistência**: Os dados mockup não são persistidos. Recarregar a página volta aos dados originais.

5. **Integração**: Para usar em produção, substitua as chamadas mockup pelas APIs reais.

## 🆘 Troubleshooting

### Dados não carregam

- Verifique se o arquivo JSON está no local correto
- Confirme se o import está funcionando
- Verifique o console para erros

### Hook não funciona

- Certifique-se de usar dentro de um componente React
- Verifique se todas as dependências estão instaladas

### Componente Demo não aparece

- Confirme se está importando corretamente
- Verifique se há erros de TypeScript

---

**🎉 Agora você tem dados completos para testar todas as funcionalidades do calendário!**
