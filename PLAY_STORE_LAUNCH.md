# GBTL — Guia de Lançamento na Google Play Store

Este documento é o **checklist completo e ordenado** para tirar o GBTL do estado atual ("MVP feature-complete") até **estar publicado e descobrível na Google Play Store**.

> ⏱️ **Tempo estimado:** 15–25 horas de trabalho efetivo, espalhadas em 5–10 dias (algumas etapas têm waits — revisão da Play Console pode levar de horas a 7 dias na 1ª submissão).
>
> 💰 **Custos:** US$ 25 (taxa única Google Play Console) + custos de domínio (~US$ 12/ano) + Vercel/Firebase (free tier serve) + Stripe (sem mensalidade, fee por transação).

---

## Sumário

- [Fase 0 — Pré-requisitos legais e empresariais](#fase-0--pré-requisitos-legais-e-empresariais)
- [Fase 1 — Provisionar contas e credenciais](#fase-1--provisionar-contas-e-credenciais)
- [Fase 2 — Configurar serviços externos](#fase-2--configurar-serviços-externos)
- [Fase 3 — Substituir placeholders no código](#fase-3--substituir-placeholders-no-código)
- [Fase 4 — Backend de pagamento (obrigatório)](#fase-4--backend-de-pagamento-obrigatório)
- [Fase 5 — Substituir mock data por backend real](#fase-5--substituir-mock-data-por-backend-real)
- [Fase 6 — Assets de marca (icon, splash, screenshots)](#fase-6--assets-de-marca-icon-splash-screenshots)
- [Fase 7 — Páginas web obrigatórias](#fase-7--páginas-web-obrigatórias)
- [Fase 8 — Qualidade: testes, crash reporting, perf](#fase-8--qualidade-testes-crash-reporting-perf)
- [Fase 9 — Build de produção com EAS](#fase-9--build-de-produção-com-eas)
- [Fase 10 — Google Play Console: setup da app](#fase-10--google-play-console-setup-da-app)
- [Fase 11 — Submissão e revisão](#fase-11--submissão-e-revisão)
- [Fase 12 — Pós-lançamento](#fase-12--pós-lançamento)
- [Checklist final consolidado](#checklist-final-consolidado)

---

## Fase 0 — Pré-requisitos legais e empresariais

> **Antes de tocar em código.** Sem isso, você não pode vender legalmente.

### 0.1. Constituir empresa ou MEI

Para vender produtos físicos no Brasil você precisa de **CNPJ**:

- **MEI** se faturamento < R$ 81k/ano (limite 2024) — trâmite simples no portal gov.br.
- **ME / LTDA** se acima — contador é mandatório.

### 0.2. Pagamento e remessas

- Stripe Brasil aceita PJ — abertura demora ~3 dias úteis.
- Alternativas locais: PagSeguro, Mercado Pago, Asaas (PIX nativo).

### 0.3. Domínio + email corporativo

- Comprar `gbtl.app` (ou similar) em Registro.br / Namecheap / Cloudflare.
- Email corporativo (Google Workspace US$ 6/mês) — necessário para suporte na Play Store.

### 0.4. Documentos legais (PRECISAM ser revisados por advogado)

- Termos de Uso
- Política de Privacidade (com LGPD + GDPR + CCPA se for vender fora do BR)
- Política de Devolução e Troca (CDC: 7 dias para arrependimento)
- Política de Frete e Prazo

Os arquivos atuais [app/privacy.tsx](app/privacy.tsx) e [app/terms.tsx](app/terms.tsx) são **placeholders** — não use em produção sem revisão jurídica.

### 0.5. Conta Google Play Developer

1. Acesse https://play.google.com/console/signup
2. Pague US$ 25 (taxa única).
3. **Para apps de e-commerce, a Google agora exige verificação de identidade D-U-N-S** (Dun & Bradstreet number) — leva 2–7 dias.
4. Para **organização**: anexar CNPJ, comprovante de endereço, contato verificável.

> ⚠️ **Política nova (2024+):** novos devs precisam testar o app com **20 testers em closed track por 14 dias consecutivos** antes de poder publicar em produção. Planeje isso.

---

## Fase 1 — Provisionar contas e credenciais

| Serviço                      | Para que                      | Custo                                           |
| ---------------------------- | ----------------------------- | ----------------------------------------------- |
| Google Cloud Console         | OAuth 2.0 (Sign-In)           | Grátis                                          |
| Stripe                       | Pagamentos                    | Sem mensalidade, ~3.99%+R$0.39 por transação BR |
| Expo (EAS)                   | Builds, OTA, Push             | Free tier OK; production tier US$ 19/mês        |
| Vercel/Firebase              | Endpoint serverless do Stripe | Free tier OK                                    |
| Apple Developer (futuro iOS) | App Store + Apple Pay         | US$ 99/ano                                      |
| Sentry (opcional)            | Crash reporting               | Free tier 5k errors/mês                         |
| PostHog (opcional)           | Analytics                     | Free tier 1M events/mês                         |

### 1.1. EAS account

```bash
npm i -g eas-cli
eas login
eas init      # cria projeto na Expo dashboard
```

Anote o **`projectId`** (UUID).

---

## Fase 2 — Configurar serviços externos

### 2.1. Google Cloud Console — OAuth 2.0

Detalhes completos em **[SETUP.md § 1](./SETUP.md#1-google-sign-in)**. Resumo:

1. Crie projeto no [Google Cloud Console](https://console.cloud.google.com/).
2. **APIs & Services → OAuth consent screen**: External, scopes `openid email profile`.
3. **Credentials**: crie **3 Client IDs**:
   - **Web** (sempre necessário) — Authorized redirect: `https://auth.expo.io/@SEU_USER/gbtl-app`
   - **Android** — package `com.gbtl.app` + SHA-1 do EAS keystore
   - **iOS** — bundle `com.gbtl.app`

**SHA-1 do EAS:**

```bash
eas credentials -p android
# Selecione: production → Keystore: View → copie o SHA-1
```

### 2.2. Stripe

1. Conta em https://stripe.com → ativar (precisa de CNPJ).
2. **Dashboard → API keys**: copie `pk_live_…` e `sk_live_…`.
3. Habilitar Apple Pay e Google Pay no dashboard.
4. (iOS) Apple Developer → registrar `merchant.com.gbtl.app`.

### 2.3. Firebase (opcional, mas recomendado)

Se for usar como backend de produtos/users/orders:

1. Crie projeto em https://console.firebase.google.com.
2. Ativar Firestore, Auth, Storage.
3. Plano **Blaze** (pay-as-you-go — tem free tier generoso).

---

## Fase 3 — Substituir placeholders no código

Abra [app.json](app.json) e substitua **todos** os valores que começam com `PLACEHOLDER_`:

```diff
"extra": {
-  "googleClientIdIos":     "PLACEHOLDER_IOS_CLIENT_ID.apps.googleusercontent.com",
-  "googleClientIdAndroid": "PLACEHOLDER_ANDROID_CLIENT_ID.apps.googleusercontent.com",
-  "googleClientIdWeb":     "PLACEHOLDER_WEB_CLIENT_ID.apps.googleusercontent.com",
-  "stripePublishableKey":  "pk_test_PLACEHOLDER",
-  "stripeMerchantId":      "merchant.com.gbtl.app",
-  "stripePaymentEndpoint": "PLACEHOLDER_https://your-domain.vercel.app/api/create-payment-intent",
-  "expoProjectId":         "PLACEHOLDER_EXPO_PROJECT_ID"
+  "googleClientIdIos":     "1234-abc.apps.googleusercontent.com",
+  "googleClientIdAndroid": "1234-def.apps.googleusercontent.com",
+  "googleClientIdWeb":     "1234-ghi.apps.googleusercontent.com",
+  "stripePublishableKey":  "pk_live_51AbC...",
+  "stripeMerchantId":      "merchant.com.gbtl.app",
+  "stripePaymentEndpoint": "https://api.gbtl.app/create-payment-intent",
+  "expoProjectId":         "12345678-abcd-..."
}
```

### Boas práticas

- **Use variantes por ambiente.** Crie `app.config.ts` substituindo `app.json` para ler de `process.env` em CI e ter perfis dev/staging/prod separados:

```ts
// app.config.ts
import 'dotenv/config'
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    stripePublishableKey: process.env.STRIPE_PK,
    stripePaymentEndpoint: process.env.STRIPE_ENDPOINT,
    // ...
  },
})
```

E ter `.env.production` (NÃO committed) com os valores reais.

---

## Fase 4 — Backend de pagamento (obrigatório)

Stripe Payment Sheet **exige** um endpoint serverless que crie o PaymentIntent com a Secret Key. **Sem isso, o checkout falha.**

### 4.1. Criar repositório separado

```bash
mkdir gbtl-api && cd gbtl-api && npm init -y
npm i stripe
```

### 4.2. Código (Vercel)

`api/create-payment-intent.ts`:

```ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // CORS para chamadas do app
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const { amount, currency = 'brl', email, description } = req.body

  // Validação básica (em produção: rate-limit, auth via JWT do app)
  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  const customer = email
    ? ((await stripe.customers.list({ email, limit: 1 })).data[0] ??
      (await stripe.customers.create({ email })))
    : undefined

  const ephemeralKey = customer
    ? await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-06-20' },
      )
    : undefined

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customer?.id,
    description,
    automatic_payment_methods: { enabled: true },
  })

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey?.secret,
    customer: customer?.id,
  })
}
```

### 4.3. Deploy

```bash
npm i -g vercel
vercel deploy --prod
```

No dashboard Vercel → Settings → Environment Variables:

- `STRIPE_SECRET_KEY` = `sk_live_…`

### 4.4. Webhook (recomendado)

Stripe pode notificar seu backend quando o pagamento confirma (importante para liberar entrega). Crie `api/stripe-webhook.ts` e registre em Stripe → Webhooks.

### 4.5. Testar antes do release

Use [cartões de teste do Stripe](https://stripe.com/docs/testing): `4242 4242 4242 4242`.

---

## Fase 5 — Substituir mock data por backend real

Hoje [src/services/products.ts](src/services/products.ts) usa `mockProducts.ts` + `setTimeout(300ms)`. Para virar produto real:

### Opção A — Firestore (mais rápido)

```ts
// src/services/products.ts
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function fetchProducts(category?: string): Promise<Product[]> {
  const ref = collection(db, 'products')
  const q = category ? query(ref, where('category', '==', category)) : ref
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
}

export async function fetchProduct(id: string): Promise<Product> {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) throw new Error('Product not found')
  return { id: snap.id, ...snap.data() } as Product
}
```

### Opção B — API REST/GraphQL própria

- Hospedar produtos em Postgres + API Node/Hono em Cloudflare Workers ou Fly.io.

### Pontos críticos

- **Imagens reais** — substituir URLs Unsplash em [src/data/mockProducts.ts](src/data/mockProducts.ts).
- **Hospedar imagens** — Cloudinary, Firebase Storage ou Imgix com transformação on-the-fly.
- **Estoque** — adicionar campo `inventory` por SKU (size+color).
- **Cadastro de produtos** — admin panel separado (Retool/Refine/Tina) ou direto no Firestore.

---

## Fase 6 — Assets de marca (icon, splash, screenshots)

Os assets em `assets/images/` são placeholders do template Expo. **Você não pode publicar com eles.**

### 6.1. Criar os assets

| Arquivo                              | Tamanho                      | Para que                  |
| ------------------------------------ | ---------------------------- | ------------------------- |
| `icon.png`                           | 1024×1024 PNG opaco          | iOS app icon              |
| `android-icon-foreground.png`        | 432×432 PNG transparente     | Android adaptive (logo)   |
| `android-icon-background.png` ou cor | Sólido                       | Fundo do adaptive icon    |
| `android-icon-monochrome.png`        | 432×432 PNG                  | Themed icon (Android 13+) |
| `splash-icon.png`                    | 1242×2436 ou square centrado | Splash screen             |
| `favicon.png`                        | 48×48                        | Web (PWA)                 |

### 6.2. Ferramentas recomendadas

- [appicon.co](https://appicon.co/) — gera todas as variações de 1 PNG
- [Expo Icon Generator](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)
- Figma/Adobe → exportar como SVG → converter

### 6.3. Assets de Play Store (separados — só na Console)

| Asset                  | Tamanho                        | Obrigatório    |
| ---------------------- | ------------------------------ | -------------- |
| App icon               | 512×512 PNG                    | ✅             |
| Feature graphic        | 1024×500 PNG                   | ✅             |
| Phone screenshots      | 1080×1920 (mínimo 2, máximo 8) | ✅ (≥2)        |
| 7" tablet screenshots  | 1200×1920                      | ⚠️ Recomendado |
| 10" tablet screenshots | 1920×1200                      | ⚠️ Recomendado |
| Promo video (YouTube)  | URL                            | ❌ Opcional    |

> **Tirar screenshots:** use [Fastlane Snapshot](https://docs.fastlane.tools/actions/snapshot/) ou tire manualmente no emulador + edite com [Screenshot Studio](https://screenshot.rocks/) (adiciona moldura + texto).

---

## Fase 7 — Páginas web obrigatórias

A Play Store **exige URLs HTTPS** públicas para:

| Documento         | URL sugerida                      | Onde linkar                           |
| ----------------- | --------------------------------- | ------------------------------------- |
| Privacy Policy    | `https://gbtl.app/privacy`        | Play Console + dentro do app          |
| Terms of Service  | `https://gbtl.app/terms`          | Play Console + dentro do app          |
| Account deletion  | `https://gbtl.app/delete-account` | Play Console (obrigatório desde 2024) |
| Support / Contact | `https://gbtl.app/support`        | Play Console                          |

### Implementação rápida

- Crie um site estático com [Astro](https://astro.build/), [Next.js](https://nextjs.org/) ou simples HTML.
- Deploy no Vercel/Netlify (free).
- Conteúdo pode ser o mesmo das telas [app/privacy.tsx](app/privacy.tsx), [app/terms.tsx](app/terms.tsx), [app/delete-account.tsx](app/delete-account.tsx).
- **Importante:** a página `/delete-account` deve permitir deleção **sem precisar abrir o app** (formulário web).

---

## Fase 8 — Qualidade: testes, crash reporting, perf

### 8.1. Sentry (crash reporting)

```bash
npx @sentry/wizard@latest -i reactNative -p ios android
```

Em [app/_layout.tsx](app/_layout.tsx):

```tsx
import * as Sentry from '@sentry/react-native'
Sentry.init({ dsn: 'https://…@sentry.io/…', tracesSampleRate: 0.2 })
```

### 8.2. Analytics

Opções: **PostHog** (recomendo — free tier 1M events), Amplitude, Firebase Analytics.

Eventos mínimos para e-commerce:

- `product_viewed`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `checkout_completed`, `wishlist_added`, `search_performed`, `category_filtered`.

### 8.3. Testes E2E

[Maestro](https://maestro.mobile.dev/) (recomendo) — mais simples que Detox.

```yaml
# .maestro/checkout.yaml
appId: com.gbtl.app
---
- launchApp
- tapOn: 'Trending'
- tapOn:
    text: "Men's Pullover Hoodie"
- tapOn: 'Add to Cart'
- assertVisible: 'My Cart'
- tapOn: 'Checkout'
```

### 8.4. Type-check e lint no pre-commit

```bash
npm i -D husky lint-staged
npx husky init
```

`.husky/pre-commit`:

```sh
npx tsc --noEmit && npx eslint . --max-warnings=0
```

### 8.5. Bundle size + perf

```bash
npx expo export --platform android
# Inspecione o bundle em dist/_expo/static/js/android/
```

Otimizações:

- **expo-image** já está em uso (cache + blurhash) ✅
- Habilitar **Hermes** (default no SDK 54) ✅
- **InteractionManager.runAfterInteractions** para trabalho pesado pós-mount
- **React.memo** em ProductCard (renderizado em FlatList)

---

## Fase 9 — Build de produção com EAS

### 9.1. Configurar `eas.json`

```bash
eas build:configure
```

Edite para algo como:

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "env": {
        "STRIPE_PK": "pk_live_…",
        "STRIPE_ENDPOINT": "https://api.gbtl.app/create-payment-intent"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 9.2. Subir versão

Em [app.json](app.json):

```json
"version": "1.0.0",
"android": { "versionCode": 1 }
```

A cada release: bumpar `versionCode` (Android) e `buildNumber` (iOS) — `autoIncrement: true` no `eas.json` faz isso automaticamente.

### 9.3. Build

```bash
eas build --platform android --profile production
```

Aguarde 10–25 min. Você receberá um `.aab` (Android App Bundle).

### 9.4. Validação local antes de subir

```bash
# Baixe o .aab e rode bundletool para gerar APK de teste
bundletool build-apks --bundle=app.aab --output=app.apks --mode=universal
bundletool install-apks --apks=app.apks
```

---

## Fase 10 — Google Play Console: setup da app

### 10.1. Criar o app

[Play Console](https://play.google.com/console) → **Create app** → preencha:

- **App name:** GBTL
- **Default language:** Portuguese (BR) ou English (US)
- **App or game:** App
- **Free or paid:** Free (a venda é dentro do app, não da app em si)

### 10.2. Dashboard — checklist obrigatório

| Item                   | Onde                         | Conteúdo                                                                                         |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **App access**         | Setup → App access           | "All features available without restrictions" OU credenciais de teste se houver auth obrigatória |
| **Ads**                | Setup → Ads                  | "No, my app does not contain ads"                                                                |
| **Content rating**     | Setup → Content rating       | Questionário IARC (e-commerce → tipicamente PEGI 3 / Livre)                                      |
| **Target audience**    | Setup → Target audience      | Adultos (18+) ou conforme público real                                                           |
| **News app**           | Setup → News app             | "No"                                                                                             |
| **COVID-19**           | Setup → COVID-19             | "No"                                                                                             |
| **Data safety**        | Setup → Data safety          | ⚠️ Mais detalhado abaixo                                                                         |
| **Government app**     | Setup → Government app       | "No"                                                                                             |
| **Financial features** | Setup → Financial features   | "No" (pagamento via Stripe é serviço de terceiros)                                               |
| **Health**             | Setup → Health               | "No"                                                                                             |
| **Privacy Policy**     | App content → Privacy Policy | URL `https://gbtl.app/privacy`                                                                   |

### 10.3. Data safety (a Google é rigorosa)

Declare **com sinceridade**:

| Dado coletado             | Por quê                 | É shared?           | Encriptado?             | User pode deletar?      |
| ------------------------- | ----------------------- | ------------------- | ----------------------- | ----------------------- |
| Email                     | Google Sign-In, recibos | Stripe (payments)   | ✅ in transit + at rest | ✅ via account deletion |
| Nome                      | Personalização          | Stripe              | ✅                      | ✅                      |
| Foto de perfil            | UI                      | ❌                  | ✅                      | ✅                      |
| ID do device (push token) | Notificações            | Expo Push (proxy)   | ✅                      | ✅                      |
| Histórico de compra       | Mostrar pedidos         | Stripe (já tem)     | ✅                      | ✅                      |
| Endereço de entrega       | Logística               | Operadora logística | ✅                      | ✅                      |
| Dados de pagamento        | Stripe processa         | Stripe              | ✅ (Stripe-PCI)         | N/A (Stripe gerencia)   |

Marque "Yes, data is encrypted in transit" e "Yes, users can request data deletion".

### 10.4. Store listing

| Campo                 | Limite             | Sugestão                                                                                                    |
| --------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **App name**          | 30 chars           | GBTL — Moda Curada                                                                                          |
| **Short description** | 80 chars           | Moda autoral, peças únicas, checkout em segundos.                                                           |
| **Full description**  | 4000 chars         | Escreva 6–8 parágrafos com SEO: marca, USP, categorias, segurança, formas de pagamento, devolução, contato. |
| **App icon**          | 512×512            | Logo final                                                                                                  |
| **Feature graphic**   | 1024×500           | Banner promocional                                                                                          |
| **Phone screenshots** | mín. 2             | Tela home, detalhe produto, carrinho, checkout                                                              |
| **7" tablet**         | opcional           | Recomendado para SEO                                                                                        |
| **10" tablet**        | opcional           | Recomendado para SEO                                                                                        |
| **App video**         | YouTube URL        | Opcional                                                                                                    |
| **Application type**  | dropdown           | Shopping                                                                                                    |
| **Category**          | dropdown           | Shopping                                                                                                    |
| **Tags**              | até 5              | Fashion, ecommerce, clothes, lifestyle, brand                                                               |
| **Contact details**   | email + site + tel | Use email corporativo                                                                                       |

### 10.5. App content

- **Privacy Policy URL:** `https://gbtl.app/privacy` (obrigatório)
- **Account deletion:** linkar `https://gbtl.app/delete-account` + caminho in-app ([app/delete-account.tsx](app/delete-account.tsx))

### 10.6. Pricing & distribution

- Free
- Países: Brasil + outros desejados (cuidado com taxas Stripe e logística internacional)
- Marketing opt-in: como preferir

---

## Fase 11 — Submissão e revisão

### 11.1. Closed testing (obrigatório para devs novos — 2024+)

1. **Testing → Closed testing → Create track**
2. Subir `.aab` (do EAS Build).
3. Adicionar **20 testers** (Gmail) — podem ser amigos/colegas.
4. Eles precisam abrir o app e usar por **14 dias consecutivos**.
5. A Play coleta métricas automaticamente.

> Sem isso, o botão "Send for review" da produção fica **bloqueado**.

### 11.2. Production track

Depois dos 14 dias:

1. **Production → Create new release**
2. Subir `.aab` (mesmo ou novo).
3. **Release name** = `1.0.0`
4. **Release notes** (pt-BR + en):
   ```
   🎉 Lançamento inicial do GBTL!
   • Catálogo curado de moda
   • Checkout com Apple Pay, Google Pay e cartão
   • Modo escuro
   • App em português e inglês
   ```
5. **Rollout percentage:** comece com 20% para mitigar bugs em escala.
6. **Save → Review release → Start rollout to production**

### 11.3. Revisão Google

- Tempo: **24h a 7 dias** (1ª submissão é a mais demorada).
- Motivos comuns de rejeição:
  - Privacy Policy não acessível
  - Account deletion não funcional
  - Permissões sem justificativa (`NOTIFICATIONS` precisa de in-app prompt opt-in claro)
  - Screenshots desatualizados
  - Conteúdo legal incompleto
  - App crasha no boot (test em devices low-end)

### 11.4. Quando aprovar

- Listing fica live em alguns minutos.
- Indexação no Search Console pode demorar horas.
- Use **link direto:** `https://play.google.com/store/apps/details?id=com.gbtl.app`

---

## Fase 12 — Pós-lançamento

### 12.1. Monitoramento (primeiras 48h)

- **Sentry dashboard** — crashes & errors.
- **Play Console → Statistics** — installs, ANRs, crashes.
- **Stripe dashboard** — transações, disputas.
- **Atendimento** — responder reviews 1-star em ≤ 24h melhora muito o rating.

### 12.2. OTA updates (sem nova submissão)

Para fixes de JS/UI:

```bash
eas update --branch production --message "Fix: cart total"
```

Atualizações nativas (deps, permissões, splash, plugins) → **nova build + submissão**.

### 12.3. Rollouts graduais

Sempre que subir versão nova:

```
Production → Create release → Staged rollout: 20% → 50% → 100%
```

Se Sentry detectar pico de crashes, pause rollout no Play Console.

### 12.4. Versionamento semântico

| Tipo de mudança      | Bump  |
| -------------------- | ----- |
| Bug fix sem novidade | 1.0.1 |
| Feature sem breaking | 1.1.0 |
| Breaking change      | 2.0.0 |

`versionCode` Android: sempre `+1`, nunca repete. Use `autoIncrement: true` no `eas.json`.

---

## Checklist final consolidado

Copie e use no seu Notion / Linear.

### Conta e legal

- [ ] CNPJ ativo (MEI/ME)
- [ ] Conta Stripe BR ativada com KYC
- [ ] Conta Google Play Developer paga (US$ 25)
- [ ] D-U-N-S verificada (se PJ)
- [ ] Domínio `gbtl.app` registrado
- [ ] Email corporativo configurado
- [ ] Termos de Uso revisados por advogado
- [ ] Privacy Policy LGPD/GDPR/CCPA
- [ ] Política de devolução (CDC art. 49)

### Credenciais externas

- [ ] Google OAuth Web Client ID
- [ ] Google OAuth Android Client ID (com SHA-1 do EAS)
- [ ] Google OAuth iOS Client ID
- [ ] Stripe `pk_live_…`
- [ ] Stripe `sk_live_…` em env var do backend
- [ ] Apple Pay merchant ID registrado (`merchant.com.gbtl.app`)
- [ ] Expo projectId (`eas init`)

### Código e config

- [ ] Todos `PLACEHOLDER_*` substituídos em `app.json`
- [ ] `app.config.ts` lê de `.env.production`
- [ ] Backend Stripe deployado e testado com cartão real (R$ 1)
- [ ] Mock data substituído por backend real
- [ ] Imagens de produto hospedadas (não Unsplash)
- [ ] `registerForPushNotificationsAsync()` implementado
- [ ] Sentry inicializado
- [ ] Analytics inicializado
- [ ] Smoke test E2E (Maestro) verde

### Assets

- [ ] `icon.png` 1024×1024 final
- [ ] `android-icon-foreground.png` 432×432 final
- [ ] `splash-icon.png` final
- [ ] App icon 512×512 (Play Store)
- [ ] Feature graphic 1024×500
- [ ] ≥ 2 phone screenshots
- [ ] Screenshots tablet 7" + 10" (recomendado)

### Páginas web

- [ ] `https://gbtl.app/privacy` (HTTPS público)
- [ ] `https://gbtl.app/terms`
- [ ] `https://gbtl.app/delete-account` (com form funcional)
- [ ] `https://gbtl.app/support`
- [ ] `.well-known/assetlinks.json` para deep links

### Play Console

- [ ] App criado
- [ ] Data safety preenchido
- [ ] Content rating (IARC) concluído
- [ ] Target audience definido
- [ ] Ads / News / Health / Government → answered
- [ ] Privacy Policy URL preenchido
- [ ] Account deletion URL preenchido
- [ ] Store listing completo (pt-BR + en-US)
- [ ] Pricing & countries

### Closed testing (obrigatório)

- [ ] 20 testers convidados
- [ ] 14 dias decorridos
- [ ] Métricas OK

### Build produção

- [ ] `eas.json` com profile `production`
- [ ] `versionCode = 1`
- [ ] `version = "1.0.0"`
- [ ] `.aab` gerado pelo EAS
- [ ] Validado localmente (bundletool ou device de teste)

### Submissão

- [ ] Release criada em "Production"
- [ ] Release notes preenchidas (pt-BR + en)
- [ ] Rollout iniciado em 20%
- [ ] Review submetida

### Pós-launch

- [ ] Sentry dashboard monitorado
- [ ] Play Console statistics monitorado
- [ ] Respostas a reviews configuradas (alertas)
- [ ] Suporte pelo email corporativo ativo

---

## Recursos úteis

- [Expo: Distribution overview](https://docs.expo.dev/distribution/introduction/)
- [Play Console help center](https://support.google.com/googleplay/android-developer)
- [Stripe Mobile docs](https://stripe.com/docs/payments/payment-element-mobile)
- [Lei Geral de Proteção de Dados (LGPD)](https://www.gov.br/anpd/pt-br)
- [Code de Defesa do Consumidor — art. 49](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)

---

**🎯 Quando todos os checkboxes estiverem marcados, você pode publicar.** Boa sorte com o lançamento.
