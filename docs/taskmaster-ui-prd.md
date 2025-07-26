# Task Master UI - Product Requirements Document

## 1. Visão Geral

### 1.1 Objetivo
Desenvolver uma aplicação web que funcione como interface de usuário para visualização de tarefas gerenciadas pelo Task Master, oferecendo uma experiência visual agradável e intuitiva para explorar a estrutura de tarefas de um projeto.

### 1.2 Escopo
A aplicação será uma ferramenta de visualização read-only que permite aos usuários carregar projetos Task Master e navegar pela estrutura de tarefas de forma hierárquica, focando na exibição das tarefas filhas da tag corrente.

## 2. Funcionalidades

### 2.1 Funcionalidades Principais

#### 2.1.1 Seleção de Projeto
- Botão para abrir diálogo de seleção de pasta do sistema operacional
- Validação automática da presença do Task Master na pasta selecionada
- Feedback visual sobre o status da validação (sucesso/erro)

#### 2.1.2 Validação de Estrutura
- Verificação da existência da pasta `.taskmaster`
- Validação da presença e estrutura do arquivo `.taskmaster/tasks/tasks.json`
- Validação da presença e estrutura do arquivo `.taskmaster/state.json`
- Utilização do Zod para validação de schema dos arquivos JSON

#### 1.2.3 Visualização de Tarefas
- Exibição das tarefas filhas da tag corrente (ex: tag "master")
- Layout responsivo e visualmente atrativo
- Apresentação hierárquica incluindo subtasks
- Informações detalhadas: título, descrição, status, prioridade, dependências, detalhes e estratégia de teste
- Suporte para diferentes status: done, in-progress, pending, blocked
- Suporte para diferentes prioridades: high, medium, low

### 2.2 Funcionalidades de Interface

#### 2.2.1 Navegação
- Breadcrumb para mostrar localização atual na hierarquia
- Navegação entre diferentes níveis da estrutura de tarefas
- Indicadores visuais de hierarquia e relacionamentos

#### 2.2.2 Exibição de Dados
- Cards ou lista estruturada para apresentação das tarefas e subtasks
- Destaque para informações importantes (status, prioridade, dependências)
- Codificação de cores para diferentes status (done=verde, in-progress=azul, pending=amarelo, blocked=vermelho)
- Indicadores visuais para prioridade (high, medium, low)
- Exibição de detalhes técnicos e estratégias de teste
- Suporte para dependências numéricas entre tarefas

## 3. Especificações Técnicas

### 3.1 Stack de Desenvolvimento
- **Frontend Framework**: React 18+ com Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Validação**: Zod para schema validation
- **Gerenciamento de Estado**: React hooks (useState, useEffect, useContext)
- **Sistema de Arquivos**: File System Access API (quando disponível) ou input file
- **Testes**: Vitest + React Testing Library + @testing-library/jest-dom + @testing-library/user-event

### 3.2 Arquitetura de Componentes
```
src/
├── components/
│   ├── ui/              # Componentes Shadcn UI
│   ├── ProjectLoader/   # Componente de seleção de projeto
│   ├── TaskViewer/      # Componente principal de visualização
│   ├── TaskCard/        # Componente individual de tarefa
│   ├── Navigation/      # Componente de navegação/breadcrumb
│   └── ErrorBoundary/   # Tratamento de erros
├── hooks/
│   ├── useProjectLoader # Hook para carregamento de projeto
│   ├── useTaskManager   # Hook para gerenciamento de tarefas
│   └── useValidation    # Hook para validações Zod
├── schemas/
│   ├── tasksSchema.ts   # Schema Zod para tasks.json
│   └── stateSchema.ts   # Schema Zod para state.json
├── types/
│   └── taskmaster.ts    # Definições de tipos TypeScript
├── utils/
│   ├── fileSystem.ts    # Utilitários para sistema de arquivos
│   └── validation.ts    # Utilitários de validação
└── __tests__/
    ├── components/      # Testes de componentes React
    ├── hooks/          # Testes de custom hooks
    ├── utils/          # Testes de utilitários
    ├── integration/    # Testes de integração
    └── __mocks__/      # Mocks para testes
```

### 3.3 Validação de Dados

#### 3.3.1 Schema para tasks.json
```typescript
// Schema baseado na estrutura real do Task Master
const SubtaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.number()).optional().default([]),
  details: z.string(),
  status: z.enum(['done', 'in-progress', 'pending', 'blocked']),
  parentTaskId: z.number()
});

const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['done', 'in-progress', 'pending', 'blocked']),
  dependencies: z.array(z.number()).optional().default([]),
  priority: z.enum(['high', 'medium', 'low']),
  details: z.string(),
  testStrategy: z.string(),
  subtasks: z.array(SubtaskSchema).optional().default([])
});

const TagSchema = z.object({
  tasks: z.array(TaskSchema)
});

const TasksFileSchema = z.record(z.string(), TagSchema);
```

#### 3.3.2 Schema para state.json
```typescript
const StateSchema = z.object({
  currentTag: z.string(),
  lastModified: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional()
});
```

## 4. Estratégia de Testes

### 4.1 Infraestrutura de Testes

#### 4.1.1 Stack de Testes
- **Test Runner**: Vitest (integração nativa com Vite)
- **Testing Library**: React Testing Library para testes de componentes
- **Matchers**: @testing-library/jest-dom para assertions customizadas
- **User Interactions**: @testing-library/user-event para simulação de interações
- **Mocking**: Vitest mocks para dependências externas

#### 4.1.2 Configuração de Testes
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### 4.2 Categorias de Testes

#### 4.2.1 Testes Unitários
**Componentes UI**:
- Renderização correta de componentes isolados
- Props passadas corretamente
- Estados internos funcionando
- Event handlers chamados adequadamente

**Hooks Customizados**:
- useProjectLoader: carregamento e validação de projetos
- useTaskManager: gerenciamento de estado das tarefas
- useValidation: validação de schemas com Zod

**Utilitários**:
- Funções de validação de arquivos
- Parsers de JSON
- Helpers de sistema de arquivos

#### 4.2.2 Testes de Integração
- Fluxo completo de carregamento de projeto
- Navegação entre níveis de tarefas
- Validação end-to-end de dados
- Interação entre componentes

#### 4.2.3 Testes de Acessibilidade
- Navegação por teclado
- Screen reader compatibility
- Contraste de cores
- ARIA attributes

### 4.3 Exemplos de Testes

#### 4.3.1 Teste de Componente
```typescript
// __tests__/components/ProjectLoader.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectLoader } from '@/components/ProjectLoader'

describe('ProjectLoader', () => {
  it('should display select project button', () => {
    render(<ProjectLoader onProjectLoad={vi.fn()} />)
    
    expect(screen.getByRole('button', { name: /selecionar projeto/i }))
      .toBeInTheDocument()
  })

  it('should call onProjectLoad when valid project is selected', async () => {
    const user = userEvent.setup()
    const mockOnProjectLoad = vi.fn()
    
    render(<ProjectLoader onProjectLoad={mockOnProjectLoad} />)
    
    const fileInput = screen.getByLabelText(/selecionar projeto/i)
    const mockFile = new File(['{}'], '.taskmaster', { type: 'application/json' })
    
    await user.upload(fileInput, mockFile)
    
    await waitFor(() => {
      expect(mockOnProjectLoad).toHaveBeenCalledWith(expect.any(Object))
    })
  })
})
```

#### 4.3.2 Teste de Hook
```typescript
// __tests__/hooks/useProjectLoader.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useProjectLoader } from '@/hooks/useProjectLoader'

describe('useProjectLoader', () => {
  it('should validate project structure correctly', async () => {
    const { result } = renderHook(() => useProjectLoader())
    
    const mockProjectData = {
      hasTaskmaster: true,
      tasksFile: { tasks: [], version: '1.0.0' },
      stateFile: { currentTag: 'main', version: '1.0.0' }
    }
    
    await waitFor(() => {
      result.current.loadProject(mockProjectData)
    })
    
    expect(result.current.isValid).toBe(true)
    expect(result.current.error).toBeNull()
  })
})
```

#### 4.3.3 Teste de Validação
```typescript
// __tests__/utils/validation.test.ts
import { validateTasksFile, validateStateFile } from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateTasksFile', () => {
    it('should validate correct tasks.json structure', () => {
      const validData = {
        "master": {
          "tasks": [
            {
              "id": 1,
              "title": "Test Task",
              "description": "Test description",
              "status": "done",
              "dependencies": [],
              "priority": "high",
              "details": "Test details",
              "testStrategy": "Test strategy"
            }
          ]
        }
      }
      
      expect(() => validateTasksFile(validData)).not.toThrow()
    })
    
    it('should throw error for invalid structure', () => {
      const invalidData = { 
        "master": { 
          "tasks": "invalid" 
        } 
      }
      
      expect(() => validateTasksFile(invalidData))
        .toThrow('Invalid tasks file structure')
    })

    it('should validate subtasks structure', () => {
      const validDataWithSubtasks = {
        "master": {
          "tasks": [
            {
              "id": 1,
              "title": "Parent Task",
              "description": "Parent description",
              "status": "in-progress",
              "dependencies": [],
              "priority": "medium",
              "details": "Parent details",
              "testStrategy": "Parent test strategy",
              "subtasks": [
                {
                  "id": 1,
                  "title": "Subtask",
                  "description": "Subtask description",
                  "dependencies": [],
                  "details": "Subtask details",
                  "status": "done",
                  "parentTaskId": 1
                }
              ]
            }
          ]
        }
      }
      
      expect(() => validateTasksFile(validDataWithSubtasks)).not.toThrow()
    })
  })

  describe('validateStateFile', () => {
    it('should validate correct state.json structure', () => {
      const validData = {
        "currentTag": "master"
      }
      
      expect(() => validateStateFile(validData)).not.toThrow()
    })
    
    it('should throw error for invalid currentTag', () => {
      const invalidData = { 
        "currentTag": 123 
      }
      
      expect(() => validateStateFile(invalidData))
        .toThrow('Invalid state file structure')
    })
  })
})
```

### 4.4 Mocks e Fixtures

#### 4.4.1 Mocks de Sistema de Arquivos
```typescript
// __tests__/__mocks__/fileSystemMocks.ts
export const mockFileSystemAccess = {
  showDirectoryPicker: vi.fn(),
  getFileHandle: vi.fn(),
  getFile: vi.fn()
}

// Mock para File System Access API
Object.defineProperty(window, 'showDirectoryPicker', {
  value: mockFileSystemAccess.showDirectoryPicker
})
```

#### 4.4.2 Fixtures de Dados
```typescript
// __tests__/fixtures/taskData.ts
export const mockTasksData = {
  valid: {
    "master": {
      "tasks": [
        {
          "id": 1,
          "title": "Set up project infrastructure",
          "description": "Initialize the Laravel project with Inertia.js and React, configure database connections, and set up the development environment using Herd.",
          "status": "done",
          "dependencies": [],
          "priority": "high",
          "details": "Create a new Laravel project using the official starter kit with Inertia.js and React. Configure PostgreSQL database connection in the .env file.",
          "testStrategy": "Verify that the application boots correctly. Check that database connections are working.",
          "subtasks": [
            {
              "id": 1,
              "title": "Create base ApplicationException class",
              "description": "Implement a base ApplicationException class that extends Laravel's Exception class.",
              "dependencies": [],
              "details": "Create a new directory App\\Exceptions\\Custom to house all custom exceptions.",
              "status": "done",
              "parentTaskId": 1
            }
          ]
        }
      ]
    }
  },
  invalid: {
    "master": {
      "tasks": "not an array"
    }
  }
}

export const mockStateData = {
  valid: {
    "currentTag": "master"
  },
  invalid: {
    "currentTag": 123
  }
}
```

### 4.5 Configuração de Coverage

#### 4.5.1 Métricas de Cobertura
- **Statements**: 80% mínimo
- **Branches**: 80% mínimo  
- **Functions**: 80% mínimo
- **Lines**: 80% mínimo

#### 4.5.2 Arquivos Excluídos
- Arquivos de configuração
- Tipos TypeScript puros
- Mocks de teste
- Build artifacts

### 4.6 Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:components": "vitest run src/__tests__/components",
    "test:hooks": "vitest run src/__tests__/hooks",
    "test:integration": "vitest run src/__tests__/integration"
  }
}
```

## 5. Design e Interface

### 5.1 Tema Visual
- **Modo**: Dark mode exclusivo
- **Paleta de Cores**:
  - Background: Tons de gray (#1a1a1a, #2a2a2a, #3a3a3a)
  - Texto: Gray claro (#e5e5e5, #f5f5f5)
  - Acentos: Amarelo (#fbbf24, #f59e0b, #d97706)
  - Estados: Verde para sucesso, vermelho para erro

### 5.2 Componentes de Interface

#### 5.2.1 Tela de Carregamento
- Botão proeminente "Selecionar Projeto"
- Área de drop para arrastar pasta (se suportado)
- Indicadores de status de validação
- Mensagens de erro claras e acionáveis

#### 5.2.2 Visualização Principal
- Header com informações do projeto e navegação
- Grid/lista responsiva de tarefas
- Sidebar com informações contextuais (opcional)
- Footer com informações de estado

#### 5.2.3 Cards de Tarefa
- Design clean com hierarquia visual clara
- Indicadores de status com cores
- Informações essenciais em destaque
- Hover states e micro-interações

### 5.3 Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Priorização de conteúdo em telas menores
- Touch-friendly para dispositivos móveis

## 6. Fluxo de Usuário

### 6.1 Fluxo Principal
1. **Inicialização**: Usuário acessa a aplicação
2. **Seleção**: Clica em "Selecionar Projeto" ou arrasta pasta
3. **Validação**: Sistema valida estrutura Task Master
4. **Carregamento**: Dados são carregados e validados
5. **Visualização**: Interface exibe tarefas da tag corrente
6. **Navegação**: Usuário pode explorar hierarquia de tarefas

### 6.2 Fluxos de Erro
- **Pasta inválida**: Mensagem clara sobre requisitos Task Master
- **Arquivos corrompidos**: Detalhes sobre problemas de validação
- **Permissões**: Orientação sobre acesso a arquivos
- **Compatibilidade**: Fallback para browsers sem File System Access API

## 7. Critérios de Aceitação

### 7.1 Funcionalidades Básicas
- [ ] Seleção de pasta funciona em todos os browsers suportados
- [ ] Validação correta da estrutura Task Master
- [ ] Carregamento e parsing dos arquivos JSON
- [ ] Exibição adequada das tarefas filhas da tag corrente
- [ ] Interface responsiva e acessível

### 7.2 Qualidade
- [ ] Tempo de carregamento < 2s para projetos típicos
- [ ] Interface fluida sem travamentos
- [ ] Mensagens de erro claras e úteis
- [ ] Design consistente com especificações visuais

### 7.3 Compatibilidade
- [ ] Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- [ ] Responsivo em dispositivos 320px-2560px
- [ ] Acessibilidade WCAG 2.1 nível AA

## 8. Considerações Técnicas

### 8.1 Limitações do Browser
- File System Access API limitada a browsers modernos
- Fallback necessário para input file em browsers mais antigos
- Considerações de segurança para acesso a sistema de arquivos

### 8.2 Performance
- Lazy loading para projetos com muitas tarefas
- Virtualização para listas muito longas
- Otimização de re-renders com React.memo

### 8.3 Segurança
- Validação rigorosa de todos os inputs
- Sanitização de conteúdo exibido
- Tratamento seguro de dados do sistema de arquivos

### 8.4 Testabilidade
- Componentes desacoplados e testáveis isoladamente
- Dependências externas mockáveis
- Estado da aplicação previsível e testável
- Cobertura de testes automatizada em CI/CD

## 9. Entregáveis

### 9.1 Fase 1 - MVP
- Seleção e validação básica de projetos
- Visualização simples de tarefas
- Interface dark mode básica

### 9.2 Fase 2 - Melhorias
- Navegação hierárquica completa
- Interface polida com animações
- Otimizações de performance

### 9.3 Fase 3 - Extras
- Export de visualizações
- Filtros e busca
- Configurações de usuário

## 10. Marcos e Timeline

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| Setup e Estrutura | 2 dias | Configuração Vite, componentes base, setup de testes |
| Core Features | 5 dias | Carregamento, validação, visualização básica + testes |
| Interface e UX | 3 dias | Styling, responsividade, animações + testes de integração |
| Testes e Refinamento | 3 dias | Coverage completo, testes e2e, otimizações |

**Total estimado**: 13 dias de desenvolvimento

### 10.1 Entregáveis por Fase

#### Fase 1 - Setup (2 dias)
- [ ] Configuração Vite + React + TypeScript
- [ ] Setup Vitest + React Testing Library
- [ ] Configuração Tailwind + Shadcn UI
- [ ] Estrutura de pastas e arquitetura base
- [ ] Primeiros testes de setup

#### Fase 2 - Core Features (5 dias)
- [ ] Componente ProjectLoader + testes
- [ ] Hooks useProjectLoader e useValidation + testes
- [ ] Schemas Zod + testes de validação
- [ ] Componente TaskViewer básico + testes
- [ ] Integração File System Access API + mocks

#### Fase 3 - Interface (3 dias)
- [ ] Design system completo
- [ ] Componentes polidos + testes visuais
- [ ] Responsividade + testes de acessibilidade
- [ ] Animações e micro-interações
- [ ] Testes de integração

#### Fase 4 - Qualidade (3 dias)
- [ ] Cobertura de testes 80%+
- [ ] Testes end-to-end principais fluxos
- [ ] Performance optimization
- [ ] Documentação de testes
- [ ] CI/CD pipeline para testes