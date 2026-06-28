# GBTL — Security Policy

> **Última auditoria:** 2026-06-28

Este documento descreve o **modelo de ameaças**, as **mitigações implementadas** e a **política de divulgação responsável** do app GBTL.

---

## Sumário executivo

### O que está protegido ✅

- Nenhuma chave secreta (`sk_live_…`, service accounts, etc.) está no app — apenas chaves **publishable/client IDs** que são públicas por design
- `.env` está no `.gitignore`; histórico Git verificado sem leaks
- Tokens de auth em **Keychain (iOS) / Keystore (Android)** via `expo-secure-store` com flag `WHEN_UNLOCKED`
- Todas as respostas externas (API, ViaCEP, Google OAuth, Stripe) **validadas com Zod** — backend comprometido não pode injetar dados malformados
- HTTPS obrigatório em todas as chamadas (exceto loopback dev)
- Input do usuário sanitizado (cupom, busca, formulários)
- Rate-limit local em ações sensíveis (checkout, cupom)
- PII (email, CPF, CNPJ, cartões, IPs) é **scrubado** antes de ir para Sentry/logs
- ErrorBoundary não vaza stack trace em produção
- Cookies desabilitados no fetch (`credentials: 'omit'`) — mobile não precisa
- Cache de respostas autenticadas desabilitado (`cache: 'no-store'`)
- Payload bomb: respostas > 5MB rejeitadas

### O que falta antes do release 🚧

1. **Backend** com validação Zod no servidor + rate-limit (Upstash)
2. **Webhook signing** do Stripe — verificar assinatura do PaymentIntent
3. **Recalcular total no backend** — nunca confiar no valor do app
4. **Certificate pinning** em chamadas críticas (opcional mas recomendado)
5. **Root/Jailbreak detection** (opcional — afasta usuários legítimos)
6. **Biometric re-auth** para mudanças de email/senha/endereço sensíveis
7. **Play Integrity API** verifica integridade do dispositivo

---

## 1. Modelo de ameaças (STRIDE)

| Categoria                  | Ameaça                                            | Mitigação atual                                                                      | Backlog                             |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------- |
| **S**poofing               | Atacante forja request ao endpoint Stripe         | Endpoint é HTTPS-only; backend precisa validar com Zod + JWT                         | Adicionar JWT do usuário ao request |
| **T**ampering              | Cliente manipula `amount` no checkout             | Backend deve recalcular total a partir do `productIds`                               | TODO no backend                     |
| **R**epudiation            | Usuário nega ter feito compra                     | Stripe gera log auditado + `paymentIntentId` salvo na order                          | Adicionar histórico de eventos      |
| **I**nformation Disclosure | Token vaza via logs                               | `logger` scrubeia PII; Sentry `beforeSend` remove email/IP/cookies                   | OK                                  |
| **D**enial of Service      | Spam de cliques no "Checkout" cria PaymentIntents | Rate-limit local (4/min) + rate-limit backend obrigatório                            | Backend: Upstash ratelimit          |
| **E**levation of Privilege | Usuário lê dados de outro user                    | Não aplica hoje (sem backend). Quando vier: backend deve filtrar por `userId` no JWT | TODO no backend                     |

---

## 2. Chaves e variáveis de ambiente

### O que pode (e deve) estar no app

Todas começam com `EXPO_PUBLIC_` e são **embarcadas no bundle** — qualquer pessoa baixando o APK pode extrair os valores. Por design isso é OK:

| Variável                              | Por que pode ser pública                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | Pública por design — só inicia Payment Sheet                 |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_*`      | OAuth Client IDs são públicos (verificação por bundle/SHA-1) |
| `EXPO_PUBLIC_STRIPE_PAYMENT_ENDPOINT` | URL pública, segurança vem do backend                        |
| `EXPO_PUBLIC_API_URL`                 | URL pública                                                  |
| `EXPO_PUBLIC_SENTRY_DSN`              | DSN é projetado para uso client-side                         |
| `EXPO_PUBLIC_POSTHOG_API_KEY`         | **Project** API Key (não Personal) — public-write only       |
| `EXPO_PUBLIC_EXPO_PROJECT_ID`         | UUID público                                                 |

### O que NUNCA pode estar no app

| Variável                         | Onde fica                             |
| -------------------------------- | ------------------------------------- |
| `STRIPE_SECRET_KEY` (`sk_…`)     | Env var no servidor serverless apenas |
| `FIREBASE_ADMIN_KEY`             | Idem                                  |
| `GOOGLE_APPLICATION_CREDENTIALS` | Idem                                  |
| `POSTHOG_PERSONAL_API_KEY`       | Idem (se necessário para reverse-ETL) |
| `SENTRY_AUTH_TOKEN`              | Só para CI uploadar sourcemaps        |

### Auditoria de leak

Execute periodicamente:

```bash
# 1. .env não está tracked
git ls-files | grep -E '\.env$|\.env\.[^e]' && echo LEAK
# Se imprimir LEAK, .env vazou — rotacione as chaves IMEDIATAMENTE.

# 2. Histórico não tem secrets
git log -p --all | grep -iE 'sk_live|sk_test|AIza[0-9A-Za-z_-]{30}|ghp_|api[-_]key.*[\"=].*[A-Za-z0-9]{20}'

# 3. Bundle final não tem strings suspeitas
npx expo export --platform android
grep -rE 'sk_live|sk_test' dist/ && echo LEAK
```

### Rotação de chaves

| Trigger                     | Ação                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| `.env` commitado por engano | Rotacione **todas** as chaves no Stripe/Google/Sentry/PostHog             |
| Funcionário sai do time     | Rotacione `STRIPE_SECRET_KEY` no backend e tokens de CI                   |
| Suspeita de comprometimento | Idem + force logout de todos os usuários (revogar refresh tokens)         |
| Trimestral (proativo)       | Rotacione `STRIPE_SECRET_KEY` (gera-se nova; app não precisa de redeploy) |

---

## 3. Autenticação e sessão

### Fluxo seguro

```
[Login] → Google OAuth 2.0 (PKCE via expo-auth-session)
       → access_token + perfil → validados com Zod
       → perfil JSON salvo em SecureStore (WHEN_UNLOCKED, dispositivo-only)
       → Zustand authStore (in-memory, sem PII no log)
```

### Bypass scenarios mitigados

- **Cleartext token em logs** → `logger` scrubeia `authorization` automaticamente
- **Token persistido no AsyncStorage** → não, usa SecureStore (Keychain/Keystore)
- **Token em backup iCloud/Google Drive** → SecureStore com `WHEN_UNLOCKED` não vai pra backup
- **Token sobrevive a logout** → `logout()` chama `deleteToken()` + `queryClient.clear()` + `resetAnalytics()`
- **Outro usuário entra no mesmo device** → `queryClient.clear()` invalida cache do anterior

### Limitações conhecidas

- Hoje o "token" guarda perfil JSON (id/email/name/picture), não um JWT. Quando vier backend real, migrar para `{ accessToken, refreshToken }`.
- Não há refresh de access_token Google — expira em ~1h → re-login. OK para MVP.

---

## 4. Pagamentos (Stripe)

### Defesas no app

- Endpoint Stripe **deve ser HTTPS** (loopback exceção em dev)
- `amount` validado: `[1, 100_000]` BRL
- `currency` validado: 3 letras minúsculas
- `metadata` sanitizado: max 50 entries, valores ≤ 500 chars
- `description` truncado a 200 chars
- `email` truncado a 320 chars
- Resposta validada com `stripeIntentResponseSchema` Zod
- `credentials: 'omit'` no fetch
- Timeout 20s
- Rate-limit local: 4 tentativas/min, burst 2
- Mensagens de erro genéricas em prod (não expor internals)

### Defesas obrigatórias no backend (a fazer)

```ts
// SEMPRE valide no servidor — nunca confie no client:
const Body = z.object({
  productIds: z.array(z.string().regex(/^p\d{3}$/)).max(50),
  shippingAddressId: z.string().optional(),
  couponCode: z
    .string()
    .regex(/^[A-Z0-9]{1,24}$/)
    .optional(),
})

// RECALCULE o total a partir dos IDs no banco
const products = await db.products.findMany({ where: { id: { in: productIds } } })
const subtotal = products.reduce((s, p) => s + p.price, 0)
// aplique cupom, frete, etc. — NUNCA use o `amount` que veio do app
```

E:

- Rate-limit por IP (10/min) + por user (4/min) via [@upstash/ratelimit](https://upstash.com/docs/oss/sdks/ts/ratelimit)
- Webhook signing: validar `stripe-signature` header
- Idempotency-Key: aceitar do cliente para evitar cobranças duplicadas se ele reenviar

---

## 5. Input do usuário

| Campo                | Sanitização                                                         |
| -------------------- | ------------------------------------------------------------------- |
| Busca de produto     | Strip control chars, max 80 chars                                   |
| Cupom                | `[^A-Z0-9]` removido, max 24 chars, rate-limit 6/min                |
| CEP (ViaCEP)         | Apenas dígitos, max 8                                               |
| Endereço (form)      | Zod schema com min/max em todos os campos                           |
| Review (texto)       | Trim + clamp 2000 chars, rating clamp [1-5]                         |
| ID de produto na URL | Regex `^[a-zA-Z0-9_-]{1,64}$` antes do fetch (evita path traversal) |

---

## 6. Persistência local

| Onde                            | O que               | Proteção                           |
| ------------------------------- | ------------------- | ---------------------------------- |
| SecureStore (`gbtl_auth_token`) | Perfil JSON         | Keychain/Keystore hardware-backed  |
| AsyncStorage (`gbtl:cart`)      | Itens do carrinho   | Não-sensível                       |
| AsyncStorage (`gbtl:wishlist`)  | IDs de produtos     | Não-sensível                       |
| AsyncStorage (`gbtl:orders`)    | Histórico de orders | Contém `shippingAddress` e `total` |
| AsyncStorage (`gbtl:addresses`) | Endereços salvos    | Contém CPF? **Não**, só logradouro |
| AsyncStorage (`gbtl:theme`)     | Preferência de tema | Não-sensível                       |

> ⚠️ **AsyncStorage NÃO é encriptado por padrão.** Endereços e orders ficam em plaintext no app sandbox. Em devices rooted/jailbroken, podem ser lidos. Quando vier backend, considerar mover dados sensíveis para o servidor (cache só local IDs).

---

## 7. Network

- **HTTPS obrigatório** em todas as chamadas (exceto `localhost` e `10.0.2.2` em dev)
- **Timeout** 15s (API), 20s (Stripe), 10s (Google OAuth), 8s (ViaCEP)
- **`credentials: 'omit'`** em todos os fetches — sem cookies
- **`cache: 'no-store'`** — respostas autenticadas não cacheadas
- **`X-Requested-With: GBTL-Mobile`** header para o backend distinguir clientes
- **Validação de Content-Type** + parse seguro
- **Limite de 5MB** por resposta (payload bomb defense)

### A fazer

- **Certificate pinning** (`react-native-ssl-pinning`) — protege contra MITM via cert comprometido. Trade-off: precisa atualizar pin a cada renovação de cert.
- **DNSSEC** no domínio `gbtl.app`

---

## 8. Logs e observabilidade

### PII scrubbing (automático)

O `logger` e o `Sentry beforeSend` removem antes do envio:

- Emails → `[email]`
- CPF → `[cpf]`
- CNPJ → `[cnpj]`
- Cartões (13-19 dígitos com separadores) → `[card]`
- IPs (v4) → `[ip]`
- Chaves contendo `password`, `token`, `secret`, `authorization`, `cookie`, `cpf`, `cnpj`, `card` → `[redacted]`

### Sentry config

- `sendDefaultPii: false`
- `beforeSend` remove `ip_address`, `cookies`, `authorization` header
- Email do user: `pa***@gmail.com` (não o email completo)
- Stack traces removidos do componentStack em prod

### Não logamos

- Senhas (não há)
- Conteúdo de cartão (Stripe nunca devolve)
- access_token Google
- `clientSecret` do PaymentIntent

---

## 9. Build e distribuição

- **EAS Secrets** para variáveis de produção: `eas secret:create --name EXPO_PUBLIC_X --value YYY`
- **`autoIncrement: true`** no `eas.json` — versionCode sempre cresce
- **Code signing**: EAS gerencia keystore Android (`eas credentials -p android`)
- **OTA Updates**: assinados pelo EAS, não permitem mudanças nativas (segurança por design)
- **Pré-release**: closed testing 14 dias na Play Console + AAB validado com `bundletool` antes da promoção a produção

---

## 10. Dependências

```bash
# Auditar vulnerabilidades regularmente
npm audit --omit=dev

# Bloquear deps com vulns críticas
npm audit --audit-level=high
```

> Adicionar [Dependabot](https://docs.github.com/code-security/dependabot) ou [Renovate](https://renovatebot.com/) para PRs automáticos de update.

### Política de versões

- **Nunca** substituir versões pinadas no `package.json` sem testar (especialmente RN, Reanimated, NativeWind — relação simbiótica)
- **Audit a cada PR** via CI (`npm audit` em `.github/workflows/ci.yml`)
- **Lock file commitado** (`package-lock.json`) — reprodutibilidade

---

## 11. Privacidade (LGPD/GDPR)

### Coletado

- **Email + nome + foto** (Google OAuth) — base legal: execução de contrato (art. 7º V LGPD)
- **Endereço de entrega** — base: execução de contrato
- **Histórico de pedidos** — base: execução de contrato + cumprimento de obrigação legal (fiscal)
- **Push token** — base: consentimento (opt-in explícito)
- **Eventos de uso** (PostHog) — base: legítimo interesse, com opt-out em Settings

### Direitos do usuário implementados

- **Acesso** → `/orders` lista pedidos, `/settings` mostra perfil
- **Deleção** → `/delete-account` deleta conta + cart + wishlist
- **Portabilidade** → exportar JSON (a fazer)
- **Revogação de tracking** → toggle "Não rastrear meu uso" em Settings

### Transferência internacional

- Stripe (USA) — base: cláusulas contratuais padrão
- PostHog (USA) — base: idem
- Sentry (USA) — base: idem
- Google OAuth (USA) — base: consentimento

Detalhar em `https://gbtl.app/privacy`.

---

## 12. Resposta a incidentes

### Severidade

| Nível  | Exemplo                                     | SLA resposta                    |
| ------ | ------------------------------------------- | ------------------------------- |
| **P0** | `sk_live` vazada / dados de cartão expostos | < 1h, rotacionar + revogar tudo |
| **P1** | App permite checkout sem pagamento          | < 4h, hotfix + OTA              |
| **P2** | XSS / bug de validação não-explorável       | < 24h, próximo release          |
| **P3** | Bug cosmético / log com PII em volume baixo | < 7d                            |

### Playbook (P0)

1. **Stop the bleeding** — rotacionar chave/desativar funcionalidade
2. **Forçar logout global** se afetou auth (rotacionar secret JWT do backend)
3. **Comunicar usuários afetados** (LGPD art. 48 — em 48h se houver risco)
4. **ANPD** se aplicável
5. **Post-mortem** público em 7 dias

---

## 13. Reportar vulnerabilidade

Encontrou um problema? **NÃO abra issue público**.

Email: `security@gbtl.app` (configurar antes do release)

Inclua:

- Versão do app + plataforma
- Passos para reproduzir
- Impacto estimado
- PoC se possível

**Compromisso:**

- Resposta inicial em 48h
- Bug bounty (a definir) para vulns válidas
- Crédito público se desejar (Hall of Fame em `https://gbtl.app/security`)

---

## 14. Checklist de auditoria periódica (trimestral)

- [ ] `git log -p` por padrões de secret
- [ ] `npm audit` sem high/critical
- [ ] Renovar SHA-1 fingerprints Google se mudou keystore
- [ ] Rotacionar `STRIPE_SECRET_KEY` no backend
- [ ] Revisar permissions Android/iOS (remover não-utilizadas)
- [ ] Testar fluxo de delete-account end-to-end
- [ ] Verificar que Sentry/PostHog não estão recebendo PII
- [ ] Atualizar este documento

---

**Referências:**

- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [LGPD — Lei 13.709/2018](https://www.gov.br/anpd/pt-br)
