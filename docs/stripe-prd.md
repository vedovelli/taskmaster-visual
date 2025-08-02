# Plano de Implementação de Assinaturas com Stripe e Supabase

## Análise do Projeto Atual

**Arquitetura Atual:**
- React 18 + Vite + TypeScript
- Shadcn UI + Tailwind CSS
- Aplicação de visualização de tarefas Task Master (read-only)
- Foco em interface visual para estrutura hierárquica de tarefas
- Não possui backend, autenticação ou funcionalidades de assinatura.

## Estratégia de Implementação Simplificada com Supabase

Para acelerar o desenvolvimento e reduzir a complexidade, a aplicação será estendida utilizando **Supabase** como backend (BaaS - Backend as a Service), eliminando a necessidade de um servidor Node.js/Express customizado.

### 1. **Backend com Supabase**
- **Autenticação:** Utilizar o **Supabase Auth** para gerenciamento de usuários (login, registro, social login).
- **Banco de Dados:** Utilizar o **Supabase Postgres** para armazenar informações de perfil de usuário e o status da assinatura.
- **Funções Serverless:** Utilizar **Supabase Edge Functions** (escritas em Deno/TypeScript) para toda a lógica de backend que interage com a API do Stripe.

### 2. **Componentes Frontend (Reutilização e Novos)**
Os componentes de UI planejados são mantidos, mas sua lógica interna será adaptada para interagir com o Supabase.
- `SubscriptionGate`: Protege conteúdo com base no status da assinatura lido do Supabase.
- `PricingPlans`: Exibe planos e chama a Edge Function para criar a sessão de checkout do Stripe.
- `SubscriptionStatus`: Mostra o status atual da assinatura do usuário.
- `BillingPortal`: Botão que chama uma Edge Function para redirecionar ao portal de cobrança do Stripe.

### 3. **Fluxo de Assinatura com Supabase**
1.  **Login/Registro:** Usuário se autentica via Supabase Auth.
2.  **Seleção de Plano:** Usuário clica em um plano. O frontend chama a Supabase Edge Function `create-checkout-session`.
3.  **Checkout:** A Edge Function cria uma sessão de checkout no Stripe e retorna a URL. O frontend redireciona o usuário para o Stripe.
4.  **Webhook:** Após o pagamento, o Stripe envia um webhook para a Supabase Edge Function `stripe-webhook`.
5.  **Atualização de Status:** A função de webhook valida o evento e atualiza a tabela de usuários no Supabase com o `subscription_status` e `stripe_customer_id`.
6.  **Acesso Liberado:** O `SubscriptionGate` no frontend detecta a mudança no status da assinatura e libera o acesso à interface completa.

### 4. **Estrutura de Implementação**

A estrutura do backend customizado é substituída por uma pasta para as funções Supabase.

**Frontend (src/):**
```
src/
├── components/
│   ├── billing/
│   │   ├── SubscriptionGate.tsx
│   │   ├── PricingPlans.tsx
│   │   ├── SubscriptionStatus.tsx
│   │   └── BillingPortal.tsx
│   └── ...
├── hooks/
│   └── useSubscription.ts  # Hook para ler status da assinatura do Supabase
├── lib/
│   └── supabaseClient.ts   # Cliente Supabase
└── types/
    └── subscription.ts
```

**Backend (supabase/):**
```
supabase/
└── functions/
    ├── create-checkout-session/
    │   └── index.ts
    ├── stripe-webhook/
    │   └── index.ts
    └── create-billing-portal-session/
        └── index.ts
```

### 5. **Planos de Assinatura Sugeridos**
(Os planos permanecem os mesmos)

**Freemium, Pro ($9.99/mês), Enterprise ($29.99/mês).**

### 6. **Implementação Faseada (Acelerada)**

**Fase 1: Configuração do Supabase e Autenticação (1-2 dias)**
- Setup do projeto no Supabase (Auth, tabelas de `profiles` e `subscriptions`).
- Integração do Supabase Auth no frontend com os componentes de UI do Shadcn.
- Proteger rotas da aplicação.

**Fase 2: Lógica de Pagamento com Edge Functions (2-3 dias)**
- Desenvolvimento e deploy das 3 Edge Functions (`create-checkout-session`, `stripe-webhook`, `create-billing-portal-session`).
- Configuração dos webhooks no Stripe para apontar para a Edge Function.
- Testes de integração entre as funções e o Stripe.

**Fase 3: Integração Frontend e Testes (1-2 dias)**
- Conectar os componentes de UI (`PricingPlans`, etc.) às Edge Functions.
- Implementar o hook `useSubscription` para reagir às mudanças no banco de dados em tempo real.
- Testes end-to-end do fluxo de assinatura.

### 7. **Considerações Técnicas**

- **Segurança:** A validação de webhooks do Stripe e a gestão de segredos (Stripe API key, Supabase service role key) são feitas de forma segura dentro das Edge Functions.
- **Performance:** O status da assinatura pode ser obtido em tempo real com o Supabase Realtime, garantindo uma UX fluida.
- **UX:** A transição para o checkout do Stripe e o retorno para a aplicação devem ser gerenciados com estados de loading claros.

### 8. **Estimativa Total (Reduzida)**
**4-7 dias de desenvolvimento**
- Backend (Supabase Functions): 45%
- Frontend & Integração: 55%

Esta abordagem reduz o tempo de desenvolvimento em mais de 50%, elimina a necessidade de gerenciar infraestrutura de backend e aproveita serviços robustos e escaláveis.
