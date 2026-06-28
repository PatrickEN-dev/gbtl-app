# GBTL — Mobile Fashion E-commerce

App mobile de e-commerce de moda construído com **React Native + Expo SDK 54**, focado em uma experiência premium, performática e pronta para produção (iOS 15+ e Android 12+).

> Status atual: **MVP feature-complete (frontend)**. Auth (Google), checkout (Stripe) e push estão wireados no código — falta apenas plugar as credenciais reais e o backend de pagamento (ver [PLAY_STORE_LAUNCH.md](./PLAY_STORE_LAUNCH.md)).

---

## Sumário

- [Visão geral do produto](#visão-geral-do-produto)
- [Stack técnica](#stack-técnica)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Setup local](#setup-local)
- [Scripts disponíveis](#scripts-disponíveis)
- [Configuração de ambiente](#configuração-de-ambiente)
- [Design system](#design-system)
- [Padrões de código](#padrões-de-código)
- [Internacionalização (i18n)](#internacionalização-i18n)
- [Estado e dados](#estado-e-dados)
- [Autenticação e segurança](#autenticação-e-segurança)
- [Pagamentos (Stripe)](#pagamentos-stripe)
- [Notificações push](#notificações-push)
- [Deep linking](#deep-linking)
- [Build e distribuição](#build-e-distribuição)
- [Roadmap](#roadmap)
- [Documentação adicional](#documentação-adicional)

---

## Visão geral do produto

GBTL é um app de moda curada (men / women / kids) com fluxo completo de compra. As telas atuais:

| Rota                                    | Tela               | Função                                                      |
| --------------------------------------- | ------------------ | ----------------------------------------------------------- |
| `/onboarding`                           | Onboarding         | 3 slides explicando a proposta — só na 1ª abertura          |
| `/(auth)/login`                         | Login              | Google Sign-In (modal) — pode ser pulado (guest)            |
| `/(tabs)` → `index`                     | Home               | Saudação, busca, categorias (Trending/Men/Women/Kids), grid |
| `/(tabs)` → `collection`                | Collection         | Lista completa com ordenação (preço, mais novos)            |
| `/(tabs)` → `cart`                      | Cart tab           | Abre o BottomSheet do carrinho global                       |
| `/product/[id]`                         | Detalhe do produto | Carrossel de imagens, cor, tamanho, qtd., add/buy           |
| `/wishlist`                             | Favoritos          | Produtos curtidos (heart icon)                              |
| `/privacy`, `/terms`, `/delete-account` | Legais             | Telas exigidas para Play/App Store                          |

O carrinho é um **BottomSheet global** (`@gorhom/bottom-sheet`) disponível em qualquer tela, com checkout via Stripe Payment Sheet (Apple Pay / Google Pay / cartão).

---

## Stack técnica

| Camada       | Tecnologia                   | Versão             | Por quê                                              |
| ------------ | ---------------------------- | ------------------ | ---------------------------------------------------- |
| Runtime      | Expo                         | `~54.0.34`         | OTA updates, EAS Build, plugins nativos sem ejection |
| UI           | React Native                 | `0.81.5`           | New Architecture (Fabric/TurboModules)               |
| Roteamento   | expo-router                  | `~6.0.24`          | File-based, deep links nativos                       |
| Styling      | NativeWind + Tailwind        | `4.2.6` / `3.4.19` | CSS-in-JS com tokens, dark mode automático           |
| Animação     | Reanimated + Gesture Handler | `4.1.1` / `2.28.0` | 60fps na UI thread                                   |
| Server state | TanStack Query               | `5.x`              | Cache, refetch, suspense-ready                       |
| Client state | Zustand                      | `5.x`              | Stores pequenos, sem boilerplate                     |
| Formulários  | react-hook-form + Zod        | `7.x` / `3.x`      | Validação tipada, performante                        |
| Pagamentos   | @stripe/stripe-react-native  | `0.50.3`           | Payment Sheet (Apple/Google Pay + cartão)            |
| Auth         | expo-auth-session (Google)   | `~7.0.11`          | OAuth 2.0 nativo iOS/Android/web                     |
| Storage      | expo-secure-store            | `~15.0.8`          | Keychain (iOS) / Keystore (Android) para tokens      |
| i18n         | i18next + react-i18next      | `26.x` / `17.x`    | EN + pt-BR, detecta locale do device                 |
| Ícones       | lucide-react-native          | `^1.21.0`          | Tree-shakable, consistente                           |
| BottomSheet  | @gorhom/bottom-sheet         | `^5.2.14`          | Carrinho global e formulários modais                 |
| Notificações | expo-notifications           | `~0.32.17`         | (Stub — ver [Notificações push](#notificações-push)) |
| Updates OTA  | expo-updates                 | `~29.0.18`         | Hot-fixes sem nova build na store                    |

> ⚠️ **Não substitua versões.** Esse stack foi calibrado para compatibilidade — em especial Tailwind v3 (NativeWind 4 ainda não suporta v4) e react-native-svg `15.12.1` exato (peer dep do Lucide).

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                       app/  (expo-router)                   │
│  Rotas + layouts, mínimo de lógica (≤150 linhas por tela)   │
└────────────┬────────────────────────────────────────────────┘
             │ usa
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    src/components/  (UI)                    │
│  ui/ · primitives/ · product/ · cart/ · forms/ · layout/    │
│  Padrão compound: ProductCard.Root/Image/Body/Footer        │
└────────────┬────────────────────────────────────────────────┘
             │ consome
             ▼
┌──────────────────────────┬──────────────────────────────────┐
│      src/hooks/          │         src/store/  (Zustand)    │
│  useCart, useProducts,   │  cartStore, wishlistStore,       │
│  useAuth, useWishlist…   │  authStore, cartUIStore          │
└──────────┬───────────────┴──────────────┬───────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────────────┐  ┌────────────────────────────┐
│       src/services/         │  │       src/lib/             │
│  products, googleAuth,      │  │  i18n, queryClient,        │
│  stripe, notifications      │  │  secureStore, animations   │
└─────────────────────────────┘  └────────────────────────────┘
```

**Regras-chave:**

- **Componentes só renderizam.** Toda lógica de negócio mora em hooks/services.
- **TanStack Query** = estado de servidor (produtos). **Zustand** = estado de cliente (cart, wishlist, auth, UI do bottom sheet).
- **Token de auth NUNCA vive em store Zustand** — só em SecureStore (Keychain/Keystore).
- **Compound components** para subcomponentes acoplados: `ProductCard.Root`, `ImageCarousel.Slide`, `Field.Root`.

---

## Estrutura de pastas

```
gbtl-app/
├── app/                              # expo-router (file-based routing)
│   ├── _layout.tsx                   # Root: providers (Query, Stripe, BottomSheet, GH, SafeArea)
│   ├── index.tsx                     # Redirect → /(tabs)
│   ├── +not-found.tsx                # 404
│   ├── onboarding.tsx                # Onboarding (1ª abertura)
│   ├── privacy.tsx, terms.tsx        # Telas legais
│   ├── delete-account.tsx            # Exigência Google Play (2024+)
│   ├── wishlist.tsx                  # Favoritos
│   ├── product/[id].tsx              # Detalhe do produto
│   ├── (auth)/                       # Group: login modal
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (tabs)/                       # Group: bottom tabs
│       ├── _layout.tsx
│       ├── index.tsx                 # Home
│       ├── collection.tsx            # Listagem
│       └── cart.tsx                  # Abre BottomSheet e redireciona
├── src/
│   ├── components/
│   │   ├── ui/                       # Button, Typography, Skeleton, SearchBar, EmptyState, ThemeToggle, QuantityStepper, Divider, Badge
│   │   ├── primitives/               # Card, IconButton, Pill
│   │   ├── layout/                   # Header, TabBar, ScreenWrapper, ErrorBoundary
│   │   ├── product/                  # ProductCard, ProductGrid, ImageCarousel, ColorSwatch, SizeSelector
│   │   ├── cart/                     # CartItem, CompactCartItem, CartSummary, CartBottomSheet
│   │   └── forms/                    # Field (compound), CheckoutForm
│   ├── hooks/                        # useAuth, useCart, useWishlist, useProduct(s), useThemeColors, useBottomSheet, useOnboarding
│   ├── store/                        # cartStore, wishlistStore, authStore, cartUIStore (Zustand)
│   ├── services/                     # products (mock), googleAuth, stripe, notifications
│   ├── lib/                          # i18n, queryClient, secureStore, animations
│   ├── schemas/                      # checkout.schema.ts (Zod)
│   ├── locales/                      # en.json, pt-BR.json
│   ├── data/                         # mockProducts.ts (substituir por API real)
│   ├── constants/                    # tokens.ts (spacing, durations)
│   └── types/                        # index.ts (Product, CartItem, AuthUser…)
├── assets/images/                    # icons, splash (placeholders — substituir antes do release)
├── sdd/                              # Spec-Driven Development (specs, tasks, agents)
├── app.json                          # Expo config (extra: client IDs, Stripe keys, endpoints)
├── babel.config.js                   # nativewind/babel + reanimated/plugin (LAST)
├── tailwind.config.js                # Tokens (cores, tipografia, raios)
├── global.css                        # CSS vars light/dark
├── tsconfig.json                     # paths: @/* → src/*
└── eslint.config.js                  # eslint-config-expo flat
```

---

## Setup local

### Pré-requisitos

- **Node.js** 20+ (LTS recomendado)
- **npm** 10+ ou **pnpm**/**bun**
- **Xcode 15+** (para iOS — apenas macOS)
- **Android Studio** (SDK 34+, JDK 17) para Android
- **EAS CLI** (`npm i -g eas-cli`) para builds de produção

### Instalação

```bash
git clone <repo-url> gbtl-app
cd gbtl-app
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` é necessário enquanto algumas peer deps do Reanimated/Lucide estão estritas.

### Rodando

```bash
npm start           # Expo Dev Server (escolha plataforma no menu)
npm run ios         # abre direto no Simulator
npm run android     # abre direto no Emulator
npm run web         # versão web (Metro + react-native-web)
```

### Limpar cache (após mudar tokens, cores, config nativa)

```bash
npx expo start --clear
```

---

## Scripts disponíveis

| Script                                            | Faz                                                         |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `npm start`                                       | Inicia Metro + Dev Server                                   |
| `npm run ios` / `npm run android` / `npm run web` | Atalhos por plataforma                                      |
| `npm run build`                                   | `eas build` — exige `eas.json` configurado e login          |
| `npm run lint`                                    | `expo lint` (eslint-config-expo)                            |
| `npx tsc --noEmit`                                | Type-check sem emitir                                       |
| `npx expo prebuild`                               | Gera projetos nativos `/ios` e `/android` (opcional, debug) |

---

## Configuração de ambiente

Todas as chaves externas vivem em **`app.json` → `expo.extra`**. Os valores atuais são `PLACEHOLDER_*`. Substitua antes de fazer build de produção. Detalhes completos em **[SETUP.md](./SETUP.md)** e **[PLAY_STORE_LAUNCH.md](./PLAY_STORE_LAUNCH.md)**.

| Chave                           | Pra que serve                       | Onde obter                                              |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------- |
| `googleClientIdIos/Android/Web` | Google Sign-In                      | Google Cloud Console → OAuth 2.0                        |
| `stripePublishableKey`          | Iniciar Payment Sheet               | Stripe Dashboard → API keys (`pk_test_…` / `pk_live_…`) |
| `stripeMerchantId`              | Apple Pay                           | Apple Developer → Identifiers → Merchant IDs            |
| `stripePaymentEndpoint`         | Serverless que cria o PaymentIntent | Seu Vercel/Firebase/Cloudflare                          |
| `expoProjectId`                 | Push tokens via Expo                | `eas init` → expo.dev                                   |

> ⚠️ **NUNCA** coloque a `STRIPE_SECRET_KEY` no app. Ela só vive como env var no backend serverless. A publishable key (`pk_…`) é pública por design.

---

## Design system

### Tokens de cor (auto light/dark via CSS vars)

| Token     | Light            | Dark      | Uso                             |
| --------- | ---------------- | --------- | ------------------------------- |
| `bg`      | `#F8F8F3`        | `#1A1F1B` | Fundo da tela                   |
| `surface` | `#FFFFFF`        | `#252A26` | Cards, sheets                   |
| `primary` | `#1A2018`        | `#F5F5F2` | Texto principal, botão primário |
| `accent`  | `#5C7C5F` (moss) | `#8FB088` | CTAs, links, destaques          |
| `muted`   | `#8E948B`        | `#9C9F95` | Texto secundário, placeholders  |
| `border`  | `#E5E5E0`        | `#3A3F3B` | Separadores, contornos          |

**Como usar:**

```tsx
// className → resolve via CSS var, troca automaticamente em dark mode
<View className="bg-bg">
  <Text className="text-primary">Olá</Text>
  <View className="border border-border" />
</View>

// JS-side (lucide color, RN shadowColor) → use o hook
import { useThemeColors } from '@/hooks/useThemeColors'
const colors = useThemeColors()
<Heart color={colors.accent} />
```

### Tipografia

Use `<Typography variant="..." />` — **nunca** `<Text>` cru:

| Variant    | Size / weight | Uso              |
| ---------- | ------------- | ---------------- |
| `display`  | 40 / 700      | Hero rarely used |
| `heading1` | 28 / 700      | Título de tela   |
| `heading2` | 22 / 600      | Seções           |
| `heading3` | 18 / 600      | Subseções        |
| `body`     | 15 / 400      | Texto padrão     |
| `body-sm`  | 13 / 400      | Captions, hints  |
| `caption`  | 11 / 500      | Microcopy        |
| `price`    | 20 / 700      | Preços           |

### Animação

Tokens em `src/lib/animations.ts`:

- **Durações:** `fast=150ms`, `base=250ms`, `slow=400ms`, `lazy=600ms`
- **Presets:** `useFadeInUp`, `useScaleIn`, `useSlideInRight`, `useStagger`, `usePressScale`, `useCartBounce`, `useShimmer`, `useParallax`
- **Spring:** `Spring.snappy`, `Spring.gentle`

> ⚠️ Use **sempre** `react-native-reanimated` — nunca a API `Animated` core do RN (perde 60fps).

### Dark mode

Toggle programático via NativeWind:

```tsx
import { useColorScheme } from 'nativewind'
const { setColorScheme } = useColorScheme()
setColorScheme('dark' | 'light' | 'system')
```

O `<ThemeToggle />` ([src/components/ui/ThemeToggle.tsx](src/components/ui/ThemeToggle.tsx)) já implementa isso.

---

## Padrões de código

### Hard rules

- `import 'react-native-gesture-handler'` deve ser a **linha 1** de [app/_layout.tsx](app/_layout.tsx).
- **Babel plugins:** `nativewind/babel` primeiro, `reanimated/plugin` **por último**.
- **Tokens, nunca hardcode:** `#F8F8F3` no código é bug — use `bg-bg`.
- **Safe area:** sempre `useSafeAreaInsets()`, nunca padding mágico.
- **Shadows:** definir os dois — `shadowColor/shadowOffset/shadowOpacity/shadowRadius` (iOS) **e** `elevation` (Android).
- **KeyboardAvoidingView:** `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
- **Telas ≤ 150 linhas.** Se passou, extraia em componente ou hook.

### Cada tela DEVE ter os 3 estados

1. **Skeleton** quando `isPending` — usar `<Skeleton />` shimmer.
2. **Error** quando `isError` — `<EmptyState icon={AlertCircle}>` com refetch.
3. **Empty** quando `data.length === 0` — `<EmptyState>` com CTA.

### Compound components

```tsx
// Composição declarativa, não props gigantes
<ProductCard.Root product={p}>
  <ProductCard.Image />
  <ProductCard.Body />
  <ProductCard.Footer />
</ProductCard.Root>

<Field.Root control={control} name="email">
  <Field.Label>Email</Field.Label>
  <Field.Input keyboardType="email-address" />
  <Field.Error />
</Field.Root>
```

### v5 — quebras de API que você precisa lembrar

- **Zustand v5:** `create<Store>()((set) => …)` — note o `()()` duplo (precisa pra TS inferir).
- **TanStack v5:** `useQuery({ queryKey, queryFn })` (objeto, não array+fn). Use `isPending` (não `isLoading`) para o estado inicial.
- **@gorhom/bottom-sheet v5:** `BottomSheetModalProvider` envolvendo o app + `useBottomSheetModal()` hook.

---

## Internacionalização (i18n)

- Locales em [src/locales/en.json](src/locales/en.json) e [src/locales/pt-BR.json](src/locales/pt-BR.json).
- Init em [src/lib/i18n.ts](src/lib/i18n.ts) — detecta locale do device (`expo-localization`), fallback EN.
- Uso: `const { t } = useTranslation(); t('home.greeting', { name: 'Pat' })`.
- **Adicionar idioma:** crie `xx.json`, importe no `i18n.ts`, adicione ao `resources`.

---

## Estado e dados

### TanStack Query (servidor)

```tsx
// src/lib/queryClient.ts — config global
staleTime: 5min, retry: 1, refetchOnWindowFocus: false

// Hooks
const { data, isPending, isError, refetch } = useProducts(category)
const { data: product } = useProduct(id)
```

Os services hoje retornam **mock data** com `setTimeout(300ms)` para simular rede ([src/services/products.ts](src/services/products.ts)). Para plugar uma API real, substitua o corpo das funções `fetchProducts` / `fetchProduct` por `fetch(...)`.

### Zustand (cliente)

| Store           | Persistência                              | Propósito                           |
| --------------- | ----------------------------------------- | ----------------------------------- |
| `cartStore`     | ❌ memória (perde no kill)                | Itens do carrinho                   |
| `wishlistStore` | ❌ memória                                | IDs favoritados                     |
| `authStore`     | ❌ memória (perfil) + SecureStore (token) | Usuário autenticado                 |
| `cartUIStore`   | ❌ memória                                | Comanda o `BottomSheetModal` global |

> 🔧 **Melhoria sugerida (P1):** plugar `zustand/middleware/persist` + `AsyncStorage` em cart e wishlist para sobreviver a relaunches. Ver [IMPROVEMENTS.md](./IMPROVEMENTS.md).

---

## Autenticação e segurança

### Fluxo

```
[Login Screen] ─► useGoogleSignIn().signIn()
                  └─ expo-auth-session/providers/google
                     └─ retorna access_token + profile
                        └─ completeGoogleLogin(profile)
                           ├─ persistUser → SecureStore
                           └─ setUser → Zustand (in-memory)

[App init] ─► restoreSession()
              └─ SecureStore.get → setUser (se existir)
```

### Princípios

- **Token sempre em SecureStore** (Keychain iOS / Keystore Android — criptografado por hardware).
- **Perfil em Zustand** (não-sensível, OK ficar em memória).
- **`queryClient.clear()` no logout** — invalida cache de usuário.

### Vulnerabilidades conhecidas (a tratar antes do release)

1. O `gbtl_auth_token` hoje guarda o **perfil JSON inteiro** (id, email, name, picture) — não é exatamente um "token". Migrar para guardar refresh token + perfil separado quando tiver backend.
2. Sem refresh do access_token Google — após expirar, usuário precisa fazer login de novo. OK para MVP.

---

## Pagamentos (Stripe)

**Implementado:** `useStripeCheckout()` em [src/services/stripe.ts](src/services/stripe.ts) usa Payment Sheet (Apple Pay + Google Pay + cartão).

**Pendente para funcionar de verdade:**

1. Criar conta Stripe + pegar `pk_test_…` e `sk_test_…`.
2. Deployar endpoint serverless (15 linhas — código pronto em [SETUP.md](./SETUP.md#2-stripe)).
3. Preencher `app.json → extra.stripePublishableKey` e `extra.stripePaymentEndpoint`.
4. (iOS) Registrar `merchant.com.gbtl.app` na Apple Developer + pôr em `extra.stripeMerchantId`.

> **Por que precisa de backend:** o PaymentIntent só pode ser criado com a Secret Key (que **NUNCA** vai pro app). O endpoint é stateless e recebe `{ amount, currency, email }` e devolve `{ clientSecret }`.

---

## Notificações push

**Estado atual:** o serviço [src/services/notifications.ts](src/services/notifications.ts) está **stub** (retorna `null`).

**Para ativar:**

1. `npm i expo-notifications expo-device` (já instalado).
2. Implementar `registerForPushNotificationsAsync()` (template em [SETUP.md](./SETUP.md#3-push-notifications)).
3. Pegar `expoProjectId` em [expo.dev](https://expo.dev).
4. Backend envia push via `https://exp.host/--/api/v2/push/send`.

---

## Deep linking

Configurado em [app.json](app.json):

- **Scheme:** `gbtl://`
- **Universal Links (Android):** `https://gbtl.app/product/*` → abre o app (precisa hospedar `.well-known/assetlinks.json`).
- **iOS Associated Domains:** `applinks:gbtl.app`.

**Rotas válidas:**

- `gbtl://product/p001` → detalhe
- `gbtl://wishlist` → favoritos
- `gbtl://(tabs)/cart` → tab cart

---

## Build e distribuição

### EAS Build

```bash
npm i -g eas-cli
eas login
eas build:configure          # cria eas.json
eas build --platform android --profile production
eas build --platform ios --profile production
```

### OTA Updates (depois de publicado)

```bash
eas update --branch production --message "Fix: cart total calculation"
```

OTA atualiza **JS/assets** sem nova submissão à store. Mudanças em código nativo (versão de plugins, permissões) **precisam** de nova build.

### Publicação nas stores

👉 Ver **[PLAY_STORE_LAUNCH.md](./PLAY_STORE_LAUNCH.md)** para o passo a passo completo de submissão na Google Play (e checklist Apple App Store).

---

## Roadmap

### P0 — Pré-lançamento (bloqueia release)

- [ ] Substituir todos `PLACEHOLDER_*` em `app.json`
- [ ] Deployar endpoint Stripe serverless
- [ ] Substituir mock data por API real (ou Firestore/Supabase)
- [ ] Substituir icon/splash placeholders
- [ ] Hospedar `https://gbtl.app/privacy`, `/terms`, `/delete-account`
- [ ] Conteúdo legal revisado por advogado
- [ ] Implementar `registerForPushNotificationsAsync()`

### P1 — Pós-lançamento curto prazo

- [ ] Persistir `cartStore` e `wishlistStore` (zustand/persist + AsyncStorage)
- [ ] Crashlytics/Sentry
- [ ] Analytics (PostHog ou Amplitude)
- [ ] Testes E2E (Maestro ou Detox)
- [ ] CI/CD (GitHub Actions: lint + tsc + EAS Build em tags)
- [ ] Variantes de produto com estoque real
- [ ] Histórico de pedidos
- [ ] Endereços salvos

### P2 — Crescimento

- [ ] Reviews & ratings
- [ ] Recomendações personalizadas
- [ ] Cupons & promoções
- [ ] A/B testing (PostHog feature flags)
- [ ] Live activities (iOS) e widgets

Detalhes técnicos em **[IMPROVEMENTS.md](./IMPROVEMENTS.md)**.

---

## Documentação adicional

| Arquivo                                            | Conteúdo                                      |
| -------------------------------------------------- | --------------------------------------------- |
| **[SETUP.md](./SETUP.md)**                         | Setup de Google Sign-In, Stripe, Push, assets |
| **[PLAY_STORE_LAUNCH.md](./PLAY_STORE_LAUNCH.md)** | Passo a passo para publicar na Play Store     |
| **[IMPROVEMENTS.md](./IMPROVEMENTS.md)**           | Análise técnica + recomendações de melhoria   |
| **[CLAUDE.md](./CLAUDE.md)**                       | Memória do projeto p/ assistentes IA          |
| **[sdd/specs/](./sdd/specs/)**                     | Design docs / specs                           |

---

## Licença

Proprietário. Todos os direitos reservados. © GBTL.
