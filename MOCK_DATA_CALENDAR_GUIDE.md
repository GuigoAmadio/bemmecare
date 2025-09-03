# Guia de Dados Mockup para o Calendário BemMeCare

## 🎯 Objetivo

Esta funcionalidade permite que você visualize e interaja com o calendário usando dados mockup (simulados) para testar e demonstrar as funcionalidades do sistema sem precisar de dados reais do backend.

## 🚀 Como Usar

### 1. Acessar a Seção de Agenda

1. Faça login no dashboard
2. Clique em "Agenda" no menu principal
3. Na seção de agenda, você verá várias abas de visualização

### 2. Carregar Dados Mockup

1. Clique na aba "Dados Mockup"
2. Você verá um painel com estatísticas e botões de ação
3. Clique em "Usar Dados" para carregar os dados mockup no calendário
4. Uma notificação aparecerá confirmando que os dados foram carregados

### 3. Visualizar no Calendário

1. Clique na aba "Calendário" para ver os dados mockup
2. Os schedules aparecerão nos dias correspondentes
3. Você pode navegar entre os meses usando as setas
4. Cada schedule mostra um indicador visual de status (cor e ícone)

### 4. Interagir com os Dados

#### Visualizar Detalhes
- Clique em qualquer schedule para ver detalhes completos
- Modal com informações detalhadas, tarefas, lembretes, etc.

#### Mover Schedules
- Arraste e solte schedules entre diferentes dias
- O sistema atualiza automaticamente a data

#### Criar Novos Schedules
- Clique no botão "+" em qualquer dia para criar uma nova task
- Preencha os detalhes e salve

#### Filtros e Busca
- Use os filtros para mostrar apenas schedules específicos
- Busque por texto, categoria, status ou prioridade
- Use a busca global para encontrar schedules rapidamente

### 5. Gerenciar Dados Mockup

#### Adicionar Mais Dados
- **Adicionar 1**: Gera um schedule aleatório
- **Adicionar 5**: Gera 5 schedules aleatórios
- **Exportar**: Baixa os dados atuais em formato JSON

#### Limpar Dados
- **Limpar**: Remove todos os dados mockup e volta aos dados originais
- **Recarregar**: Volta aos dados mockup originais

## 📊 Tipos de Dados Disponíveis

### Categorias
- **WORK**: Trabalho e projetos
- **PERSONAL**: Pessoal e vida privada
- **MEETING**: Reuniões e encontros
- **APPOINTMENT**: Consultas e compromissos
- **REMINDER**: Lembretes importantes
- **OTHER**: Outros tipos

### Status
- **PENDING**: Pendente
- **IN_PROGRESS**: Em andamento
- **COMPLETED**: Concluído
- **CANCELLED**: Cancelado
- **POSTPONED**: Adiado

### Prioridades
- **LOW**: Baixa
- **MEDIUM**: Média
- **HIGH**: Alta
- **URGENT**: Urgente

## 🎨 Funcionalidades do Calendário

### Visualização
- **Vista Mensal**: Calendário tradicional com todos os dias
- **Vista Semanal**: Foco na semana atual
- **Vista Lista**: Lista organizada de todos os schedules
- **Estatísticas**: Resumo visual dos dados

### Interatividade
- **Drag & Drop**: Mover schedules entre dias
- **Cores Personalizadas**: Alterar cor de dias específicos
- **Filtros Avançados**: Combinar múltiplos critérios
- **Busca Global**: Encontrar schedules rapidamente

### Personalização
- **Cores por Categoria**: Cada categoria tem uma cor padrão
- **Ícones de Status**: Indicadores visuais claros
- **Layout Responsivo**: Funciona em todos os dispositivos

## 🔧 Recursos Técnicos

### Persistência
- Dados mockup são salvos no localStorage
- Persistem entre sessões do navegador
- Podem ser exportados e importados

### Performance
- Carregamento otimizado com lazy loading
- Cache inteligente para melhor performance
- Atualizações em tempo real

### Compatibilidade
- Funciona com todos os navegadores modernos
- Suporte completo para dispositivos móveis
- Integração perfeita com o sistema existente

## 🚨 Limitações

### Dados Mockup
- Não são sincronizados com o backend real
- Mudanças não são persistidas no banco de dados
- Apenas para desenvolvimento e demonstração

### Funcionalidades
- Algumas funcionalidades avançadas podem não estar disponíveis
- Notificações reais não são enviadas
- Integrações externas não funcionam

## 💡 Dicas de Uso

### Para Desenvolvedores
- Use para testar novas funcionalidades
- Demonstre o sistema para stakeholders
- Valide a experiência do usuário

### Para Usuários
- Explore todas as funcionalidades sem risco
- Teste diferentes cenários de uso
- Familiarize-se com a interface

### Para Demonstrações
- Prepare cenários específicos
- Use dados que façam sentido para o público
- Destaque as funcionalidades principais

## 🆘 Solução de Problemas

### Dados Não Aparecem
1. Verifique se clicou em "Usar Dados"
2. Confirme que está na aba "Calendário"
3. Recarregue a página se necessário

### Erro ao Carregar
1. Verifique o console do navegador
2. Tente recarregar os dados mockup
3. Limpe o cache do navegador se necessário

### Performance Lenta
1. Reduza a quantidade de dados mockup
2. Use filtros para limitar a visualização
3. Navegue para meses específicos

## 🔮 Próximas Funcionalidades

- [ ] Sincronização com calendários externos
- [ ] Templates de schedules pré-definidos
- [ ] Histórico de mudanças
- [ ] Backup automático de dados mockup
- [ ] Modo colaborativo para equipes

---

**Desenvolvido com ❤️ para a plataforma BemMeCare**
