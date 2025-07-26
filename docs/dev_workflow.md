# Development Workflow Guide

## Para Cursor AI e Claude Code

---

## ⚠️ PRINCÍPIOS FUNDAMENTAIS

> **ESTAS INSTRUÇÕES SÃO OBRIGATÓRIAS** e devem ser seguidas à risca durante todo o desenvolvimento. Nenhum item pode ser negligenciado. **JAMAIS ASSUMA ALGO - SEMPRE PERGUNTE EM CASO DE DÚVIDAS.**

---

## 🔄 WORKFLOW PADRÃO

### 1. 📋 RECEBIMENTO DA TAREFA

- Receba a tarefa ou subtarefa a ser desenvolvida
- Identifique o ID da tarefa no sistema Task Master
- **Ação**: Aguarde instruções claras sobre qual tarefa implementar

### 2. 🔍 OBTENÇÃO DE DETALHES

- **Ação**: Utilize o **MCP Task Master** para obter detalhes completos
- Extraia informações essenciais:
  - Título e descrição
  - Dependências
  - Critérios de aceitação
  - Estratégia de teste
  - Detalhes técnicos específicos

### 3. 🧠 PLANEJAMENTO COM DEEPTHINK

- **Ação**: Utilize `deepthink` para criar um plano de ação detalhado
- **Princípios do planejamento**:
  - ✅ **Simplicidade**: Busque sempre a solução mais simples
  - ❌ **Evite overengineering**: Não complique desnecessariamente
  - 🎯 **Elegância**: Soluções limpas e bem estruturadas
  - 📝 **Documentação**: Plano claro e executável

**Template do plano deepthink**:

```
## Análise da Tarefa
- Objetivo principal:
- Dependências identificadas:
- Impacto no sistema:

## Abordagem Escolhida
- Solução proposta:
- Justificativa da simplicidade:
- Componentes a serem modificados/criados:

## Passos de Implementação
1. [Passo específico]
2. [Passo específico]
3. [Passo específico]

## Validação
- Critérios de sucesso:
- Pontos de verificação:
```

### 4. 📊 ATUALIZAÇÃO DE STATUS - INÍCIO

- **Ação**: Marque a tarefa/subtarefa como `in-progress` no Task Master
- Confirme que o status foi atualizado com sucesso

### 5. 🔍 VERIFICAÇÃO INICIAL DE QUALIDADE

- **Ação**: Execute `npm run qa` antes de iniciar desenvolvimento
- **Se problemas forem reportados**:
  - ⚠️ **PARE** - não prossiga com desenvolvimento
  - Resolva TODOS os problemas identificados
  - Execute `npm run qa` novamente até estar limpo
  - Só então prossiga para implementação

### 6. ⚙️ IMPLEMENTAÇÃO

- Siga o plano criado no deepthink
- Crie um feature branch baseado em `main` e faça seu trabalho neste feature branch
- Mantenha commits pequenos e frequentes durante desenvolvimento
- **Princípios durante implementação**:
  - 🎯 Foque no essencial
  - 📝 Comente código quando necessário
  - 🧪 Escreva testes conforme estratégia definida
  - 🔄 Faça refatorações incrementais

### 7. 🔍 VERIFICAÇÃO FINAL DE QUALIDADE

- **Ação**: Execute `npm run qa` após conclusão
- **Se problemas forem reportados**:
  - ⚠️ **OBRIGATÓRIO** - resolva TODOS os problemas
  - Não prossiga para commit até QA estar limpo
  - Execute novamente até passar completamente

### 8. 💾 COMMIT

- Faça commit apenas quando QA estiver 100% limpo
- Sempre utilize `git add --all`
- **Padrão de mensagem de commit**:

```
type(scope): description

- Implementa funcionalidade X conforme tarefa #ID
- Resolve dependências Y e Z
- Adiciona testes para cenários A, B, C

Closes #TaskID
```

**Tipos válidos**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 9. ✅ ATUALIZAÇÃO DE STATUS - CONCLUSÃO

- **Ação**: Marque a tarefa/subtarefa como `done` no Task Master
- Confirme que o status foi atualizado corretamente
- Atualize a tarefa com detalhes de implementação

### 10. 📝 LOGGING DO DESENVOLVIMENTO

- **Ação**: Utilize **Basic Memory MCP** para registrar o desenvolvimento
- **Template do log**:

```
## Desenvolvimento Tarefa #[ID]
**Data**: [Data atual] (utilize no shell `date "+%Y-%m-%d_%H:%M:%S"` para obter o timestamp)
**Título**: [Título da tarefa]

### Resumo
- Status: Concluída
- Tempo estimado: [tempo]
- Tempo empregado: [tempo]
- Abordagem utilizada: [breve descrição]

### Implementação
- Arquivos modificados: [lista]
- Testes adicionados: [sim/não - detalhes]
- Dependências: [se aplicável]

### Observações
- [Pontos importantes para futuras referências]
- [Decisões técnicas tomadas]
- [Possíveis melhorias futuras]
```

### 11. ⛄ ABERTURA DO PULL REQUEST

Utilize o Github CLI, para abrir um PR com uma descrição abrangente e precisa sobre a implementação.

### 12. 📢 NOTIFICAÇÃO DE FINALIZAÇÃO

- **Ação**: Notifique sobre a conclusão da tarefa
- **Formato da notificação**:

```
✅ Tarefa #[ID] concluída com sucesso

📋 [Título da tarefa]
🔧 Implementação: [breve resumo]
✔️ QA: Passou em todas as verificações
💾 Commit: [hash do commit]
📝 Log: Registrado no Basic Memory MCP
```

---

## 🛠️ COMANDOS E FERRAMENTAS

### MCP Task Master

```bash
# Obter detalhes da tarefa
get-task --id [TASK_ID]

# Atualizar status
update-task-status --id [TASK_ID] --status [in-progress|done]
```

### Scripts de QA

```bash
# Execução completa de QA
npm run qa

# Verificações individuais (se disponíveis)
npm run lint
npm run typecheck
npm run test:run
npm run build
```

### Basic Memory MCP

```bash
# Registrar log de desenvolvimento
log-development --task-id [TASK_ID] --details "[detalhes]"
```

---

## ⚡ VERIFICAÇÕES OBRIGATÓRIAS

### ✅ Antes de Iniciar Desenvolvimento

- [ ] Tarefa claramente entendida
- [ ] Detalhes obtidos via MCP Task Master
- [ ] Plano deepthink criado e validado
- [ ] Status atualizado para `in-progress`
- [ ] QA inicial executado e limpo

### ✅ Durante Desenvolvimento

- [ ] Seguindo plano estabelecido
- [ ] Commits incrementais sendo feitos
- [ ] Testes sendo escritos conforme necessário
- [ ] Código limpo e bem estruturado

### ✅ Antes do Commit

- [ ] Implementação completa conforme tarefa
- [ ] QA executado e 100% limpo
- [ ] Testes passando
- [ ] Código revisado

### ✅ Após Conclusão

- [ ] Status atualizado para `done`
- [ ] Log registrado no Basic Memory MCP
- [ ] Notificação de conclusão enviada
- [ ] Commit realizado com mensagem adequada

---

## 🚫 O QUE JAMAIS FAZER

- ❌ Pular verificações de QA
- ❌ Commitar com problemas de qualidade
- ❌ Assumir requisitos não especificados
- ❌ Overengineering de soluções
- ❌ Prosseguir sem atualizar status das tarefas
- ❌ Esquecer de registrar logs de desenvolvimento
- ❌ Implementar sem plano deepthink

---

## 🆘 EM CASO DE PROBLEMAS

### QA Falhando

1. **PARE** toda implementação
2. Analise os erros reportados
3. Resolva um por vez
4. Execute QA novamente
5. Só continue quando estiver 100% limpo

### Dúvidas sobre Requisitos

1. **NÃO ASSUMA** - sempre pergunte
2. Consulte detalhes da tarefa no Task Master
3. Solicite esclarecimentos específicos
4. Documente esclarecimentos para futuras referências

### Problemas Técnicos

1. Consulte logs de desenvolvimento anteriores
2. Verifique dependências da tarefa
3. Solicite orientação técnica específica
4. Documente solução para casos similares

---

## 📊 MÉTRICAS DE QUALIDADE

O workflow é considerado bem-sucedido quando:

- ✅ 100% das verificações de QA passam
- ✅ Tarefa implementada conforme especificação
- ✅ Status corretamente atualizado no Task Master
- ✅ Log completo registrado no Basic Memory MCP
- ✅ Commit limpo e bem documentado
- ✅ Zero retrabalho necessário

---

**Lembre-se: Este workflow garante qualidade, rastreabilidade e consistência. Seguir cada etapa religiosamente é fundamental para o sucesso do projeto.**
