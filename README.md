# BemMeCare - Plataforma de Gestão de Saúde

Uma aplicação moderna e completa para gestão de saúde e bem-estar, desenvolvida com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Features

- **Landing Page Atrativa**: Página inicial com design moderno e responsivo
- **Dashboard Administrativo**: Painel completo para gestão do negócio
- **Gestão de Agendamentos**: Controle de consultas e exames
- **Controle de Vendas**: Acompanhamento de receitas e transações
- **Gestão de Produtos**: Controle de estoque e catálogo
- **Relatórios Detalhados**: Análises e insights do negócio
- **Configurações Avançadas**: Personalização completa do sistema

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **Zod** - Validação de esquemas

## 📦 Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd bemMeCare
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute a aplicação**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciais de Acesso

Para acessar a área administrativa, use as seguintes credenciais:

- **Email**: `admin@bemmecare.com`
- **Senha**: `admin123`

## 📱 Estrutura da Aplicação

### Landing Page (`/`)

- Página inicial com informações da empresa
- Design responsivo e moderno
- Botão de acesso à área logada

### Área Logada (`/dashboard`)

- **Painel**: Visão geral com estatísticas e métricas
- **Agendamentos**: Gestão de consultas e exames
- **Vendas**: Controle de receitas e transações
- **Produtos**: Gestão de estoque e catálogo
- **Relatórios**: Análises detalhadas do negócio
- **Configurações**: Personalização do sistema

## 🎨 Design System

A aplicação utiliza um design system consistente com:

- **Cores Primárias**: Azul (#3B82F6) para elementos principais
- **Cores Secundárias**: Cinza para textos e elementos neutros
- **Cores de Status**: Verde (sucesso), Amarelo (aviso), Vermelho (erro)
- **Tipografia**: Inter font para melhor legibilidade
- **Componentes**: Cards, botões e formulários padronizados

## 📊 Funcionalidades por Seção

### Dashboard Principal

- Estatísticas em tempo real
- Gráficos de performance
- Atividades recentes
- Próximos agendamentos

### Agendamentos

- Lista de consultas e exames
- Filtros e busca avançada
- Status de agendamentos
- Informações de contato

### Vendas

- Histórico de transações
- Métricas de receita
- Métodos de pagamento
- Análise de conversão

### Produtos

- Catálogo completo
- Controle de estoque
- Alertas de estoque baixo
- Categorização de produtos

### Relatórios

- Análises de vendas
- Relatórios de pacientes
- Dados financeiros
- Exportação de dados

### Configurações

- Informações da empresa
- Perfil do usuário
- Notificações
- Segurança
- Backup de dados

## 🚀 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# URLs da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Configurações de autenticação
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000

# Configurações da empresa
NEXT_PUBLIC_COMPANY_NAME=BemMeCare
NEXT_PUBLIC_COMPANY_EMAIL=contato@bemmecare.com
```

## 📝 Próximos Passos

Esta aplicação está preparada para integração com o backend. Os próximos passos incluem:

1. **Integração com API**: Conectar com endpoints do backend
2. **Autenticação Real**: Implementar sistema de login seguro
3. **Dados Dinâmicos**: Substituir dados mockados por dados reais
4. **Gráficos Interativos**: Implementar bibliotecas de gráficos
5. **Notificações**: Sistema de notificações em tempo real
6. **Upload de Arquivos**: Funcionalidade de upload de documentos

## 🤝 Contribuição

Esta aplicação foi desenvolvida como parte do sistema MoneyMaker para gestão multi-tenant de diferentes tipos de negócios.

## 📄 Licença

Este projeto é privado e destinado ao uso interno da organização.

---

**BemMeCare** - Cuidando da sua saúde com tecnologia 💙
