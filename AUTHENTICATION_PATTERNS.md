# Padrões de Autenticação no Next.js

## Problema Original

O projeto estava tentando fazer requisições autenticadas diretamente do client-side para o backend Laravel, o que causava:

- ❌ Erro 401 (Unauthorized)
- ❌ Token exposto no JavaScript (vulnerabilidade XSS)
- ❌ Complexidade no gerenciamento manual de tokens
- ❌ Problemas de sincronização entre server e client

## Soluções Implementadas

### 1. API Routes (Proxy Pattern)

**Arquivo:** `src/app/api/cart/route.ts`

**Como funciona:**
```
Frontend → API Route Next.js → Backend Laravel
         (cookies httpOnly)    (Bearer Token)
```

**Vantagens:**
- ✅ Token seguro (httpOnly cookies)
- ✅ Compatível com fetch() padrão
- ✅ Fácil de usar com React Query
- ✅ Cache automático do Next.js
- ✅ Middleware personalizado possível

**Desvantagens:**
- ⚠️ Mais código boilerplate
- ⚠️ Duplicação de rotas (uma para cada endpoint)
- ⚠️ Execução serverless (custo por requisição)

**Exemplo de uso:**
```typescript
// No CartContext
const response = await fetch('/api/cart', {
  method: 'GET',
  credentials: 'include' // Envia cookies automaticamente
})
```

### 2. Server Actions

**Arquivo:** `src/app/actions/cart.ts`

**Como funciona:**
```
Frontend → Server Action → Backend Laravel
         (automático)     (Bearer Token)
```

**Vantagens:**
- ✅ Token seguro (httpOnly cookies)
- ✅ Menos código boilerplate
- ✅ Revalidação automática com `revalidatePath()`
- ✅ TypeScript end-to-end
- ✅ Integração nativa com formulários
- ✅ Progressive Enhancement

**Desvantagens:**
- ⚠️ Menos flexível que API Routes
- ⚠️ Mais difícil de usar com React Query
- ⚠️ Execução serverless (custo por requisição)

**Exemplo de uso:**
```typescript
// Com useTransition
const [isPending, startTransition] = useTransition()

startTransition(async () => {
  const result = await addToCartAction({ product_id: 1, quantity: 1 })
  if (result.success) {
    // Sucesso
  }
})
```

## Comparação de Custos

### Cenário Atual (Problemático)
```
Client → Backend Laravel (ERRO 401)
```
- 💰 Custo: Baixo (mas não funciona)
- 🔒 Segurança: Baixa (token exposto)

### API Routes
```
Client → Next.js API Route → Laravel
```
- 💰 Custo: Médio (2 execuções serverless)
- 🔒 Segurança: Alta (token httpOnly)
- 📊 Cache: Possível

### Server Actions
```
Client → Next.js Server Action → Laravel
```
- 💰 Custo: Médio (2 execuções serverless)
- 🔒 Segurança: Alta (token httpOnly)
- 📊 Cache: Revalidação automática

## Estratégias de Otimização

### 1. Híbrida (Recomendada)
```typescript
// Leitura: API Routes com cache
const { data } = useQuery({
  queryKey: ['cart'],
  queryFn: () => fetch('/api/cart').then(r => r.json()),
  staleTime: 5 * 60 * 1000 // 5 minutos
})

// Escrita: Server Actions
const addToCart = async (item) => {
  await addToCartAction(item)
  queryClient.invalidateQueries(['cart'])
}
```

### 2. Cache Agressivo
```typescript
// API Route com cache
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  })
}
```

### 3. Batch Operations
```typescript
// Server Action para múltiplas operações
export async function batchCartOperations(operations: CartOperation[]) {
  // Processa múltiplas operações em uma única chamada
}
```

## Implementação no Projeto

### Arquivos Modificados/Criados:

1. **`src/app/api/cart/route.ts`** - API Routes para carrinho
2. **`src/app/actions/cart.ts`** - Server Actions para carrinho
3. **`src/context/CartContext.tsx`** - Modificado para usar API Routes
4. **`src/components/CartWithServerActions.tsx`** - Exemplo com Server Actions
5. **`src/app/actions/auth.ts`** - Cookie httpOnly = false (temporário)

### Configuração de Ambiente:

```env
# .env.local
BACKEND_URL=http://localhost:8000
```

## Recomendações

### Para este projeto:
1. **Use API Routes** para operações de leitura (GET)
2. **Use Server Actions** para operações de escrita (POST/PUT/DELETE)
3. **Combine com React Query** para cache client-side
4. **Reverta httpOnly = true** após implementar a solução

### Padrão de segurança:
```typescript
// ✅ CORRETO - Server-side
const token = cookies().get('auth-token') // httpOnly

// ❌ INCORRETO - Client-side
const token = document.cookie // Vulnerável a XSS
```

## Próximos Passos

1. Testar as API Routes criadas
2. Implementar Server Actions onde apropriado
3. Configurar React Query para cache
4. Reverter `httpOnly = true` no cookie de auth
5. Implementar middleware de autenticação
6. Adicionar tratamento de erro global

## Conclusão

A arquitetura implementada resolve o problema de autenticação mantendo a segurança e seguindo as melhores práticas do Next.js. O frontend agora se comunica com o Next.js (API Routes/Server Actions), que por sua vez se comunica de forma segura com o backend Laravel usando tokens httpOnly.

**Regra de ouro:** Se precisa de autenticação, sempre passe pela camada server do Next.js. Client-side apenas para dados públicos.