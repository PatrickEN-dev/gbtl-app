# GBTL — Production Setup

Tudo abaixo é necessário para o app rodar de verdade (Google Sign-In, Stripe, Push) e ser publicado na Play Store. O código já está pronto; só faltam as chaves/IDs externos.

Todas as configurações vivem em **`app.json` → `expo.extra`**. Substitua os valores `PLACEHOLDER_*` pelos reais.

---

## 1. Google Sign-In

### Crie OAuth 2.0 Client IDs

1. Acesse [Google Cloud Console](https://console.cloud.google.com/) → crie um projeto.
2. Em **APIs & Services → OAuth consent screen**: configure como "External", preencha nome do app, email de suporte, scopes (`openid`, `email`, `profile`).
3. Em **Credentials → Create Credentials → OAuth client ID**, crie **3 client IDs**:

| Tipo | Para que serve | O que preencher |
|---|---|---|
| **Web application** | Required (sempre) | Authorized redirect URIs: `https://auth.expo.io/@SEU_USERNAME/gbtl-app` |
| **iOS** | Build iOS | Bundle ID: `com.gbtl.app` |
| **Android** | Build Android | Package name: `com.gbtl.app` + SHA-1 fingerprint do certificado de signing |

Para pegar o SHA-1 Android em dev: `npx expo prebuild --platform android && cd android && ./gradlew signingReport`. Para production: pegue o SHA-1 do EAS Build dashboard ou do Google Play Console (Setup → App signing).

### Cole os Client IDs em `app.json`

```json
"extra": {
  "googleClientIdIos":     "1234567890-abc.apps.googleusercontent.com",
  "googleClientIdAndroid": "1234567890-def.apps.googleusercontent.com",
  "googleClientIdWeb":     "1234567890-ghi.apps.googleusercontent.com"
}
```

**Pronto.** O hook `useGoogleSignIn()` ([src/services/googleAuth.ts](src/services/googleAuth.ts)) e a tela `app/(auth)/login.tsx` já estão wireados.

---

## 2. Stripe

### Conta + chaves

1. Crie conta em [stripe.com](https://stripe.com).
2. **Dashboard → Developers → API keys**: copie a **Publishable key** (`pk_test_...` para dev; `pk_live_...` para prod) e a **Secret key** (`sk_test_...`).
3. Em **app.json**:
   ```json
   "stripePublishableKey": "pk_test_51AbCd...",
   "stripeMerchantId":     "merchant.com.gbtl.app",   // p/ Apple Pay — registre depois em Developer Apple
   ```

### Endpoint serverless (obrigatório)

Stripe Payment Sheet **precisa** de um endpoint que crie o PaymentIntent com a Secret Key (que **NUNCA** pode ir pro app). É 15 linhas de código.

**Opção A — Vercel (recomendado, grátis):**

1. Crie um repo separado com este `api/create-payment-intent.ts`:
   ```ts
   import Stripe from 'stripe'
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

   export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).end()
     const { amount, currency = 'usd', email, description } = req.body
     const customer = email
       ? (await stripe.customers.list({ email, limit: 1 })).data[0]
         ?? (await stripe.customers.create({ email }))
       : undefined
     const ephemeralKey = customer
       ? await stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2024-06-20' })
       : undefined
     const paymentIntent = await stripe.paymentIntents.create({
       amount, currency,
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
2. `npm i stripe` no projeto do endpoint.
3. `vercel deploy` (ou push pro GitHub conectado).
4. Em **Vercel project settings → Environment Variables**: adicione `STRIPE_SECRET_KEY=sk_test_...`.
5. Copie a URL final (ex: `https://gbtl-api.vercel.app/api/create-payment-intent`) em **app.json**:
   ```json
   "stripePaymentEndpoint": "https://gbtl-api.vercel.app/api/create-payment-intent"
   ```

**Opção B — Firebase Functions:** mesma lógica, deploy via `firebase deploy --only functions`. Vai precisar do plano Blaze (pago, mas free tier generoso).

**Opção C — Cloudflare Workers, AWS Lambda, etc.:** funciona com qualquer serverless.

### Testando

Em modo `pk_test_`, use [cartões de teste do Stripe](https://stripe.com/docs/testing): `4242 4242 4242 4242`, qualquer CVC, qualquer data futura.

---

## 3. Push Notifications

### Expo Project ID

1. Crie conta em [expo.dev](https://expo.dev) (grátis).
2. Crie um projeto: `eas init` (precisa de `eas-cli`: `npm i -g eas-cli`).
3. Pegue o `projectId` (UUID) em [expo.dev/accounts/SEU_USER/projects/gbtl-app/](https://expo.dev).
4. Cole em **app.json**:
   ```json
   "expoProjectId": "12345678-abcd-..."
   ```

### Enviando push

Use a [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/) ou ferramenta como [exp.host/notifications](https://expo.dev/notifications):

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[...]",
    "title": "Sale today!",
    "body": "20% off all hoodies."
  }'
```

O token é o que `registerForPushNotificationsAsync()` retorna no [src/services/notifications.ts](src/services/notifications.ts).

---

## 4. App Icon + Splash

Os assets atuais (`assets/images/icon.png`, `splash-icon.png`, etc.) são placeholders do template Expo. Antes de publicar:

1. Crie um icon **1024×1024 PNG**, fundo opaco. Substitua `assets/images/icon.png`.
2. Para Android adaptive icon: precisa de um **foreground 432×432** (PNG transparente) — substitua `assets/images/android-icon-foreground.png`.
3. Splash: PNG **1242×2436** ou square, com o logo centralizado — substitua `assets/images/splash-icon.png`.
4. Recomendo usar [Expo Icon Generator](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/) ou ferramenta como [appicon.co](https://appicon.co/) pra gerar todas as variações.

A cruz preta que está no app (componente `<Plus>` da lucide) pode virar logo: exporte como SVG → converta pra PNG nas resoluções acima.

---

## 5. Deep Linking

Scheme já configurado em `app.json`: `gbtl`. Links válidos:

- `gbtl://product/p001` — abre o detalhe do produto
- `gbtl://wishlist` — abre a tela de favoritos
- `gbtl://(tabs)/cart` — vai pra aba cart

Para **HTTPS Universal Links** (Android):
- Configure `intentFilters` já feito em app.json (`https://gbtl.app/product/*` → abre o app)
- Hospede o arquivo `.well-known/assetlinks.json` em `https://gbtl.app/` (gerado pela Play Console depois de uploadar o app).

---

## 6. Publicação na Play Store

### Build

```bash
npm i -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

### Play Console — checklist obrigatório

- [ ] **Privacy Policy URL** público (precisa estar hospedado em algum lugar). Pode usar o conteúdo de [app/privacy.tsx](app/privacy.tsx) como base, mas precisa de um URL HTTPS.
- [ ] **Account deletion** — exigência da Google (since 2024). Você já tem [app/delete-account.tsx](app/delete-account.tsx). Tem que linkar ela ANTES do submit + ter uma página web também (mesmo conteúdo, hospedada).
- [ ] **Data safety form** — declarar quais dados o app coleta (email/nome via Google, payment via Stripe, push token via Expo).
- [ ] **App content rating** — questionário IARC.
- [ ] **Target audience** — definir faixa etária.
- [ ] **Ads declaration** — "Não" se você não tem ads.
- [ ] **News apps** — "Não" se não é app de notícias.
- [ ] **Pricing & distribution** — countries, paid/free.
- [ ] **Screenshots** — pelo menos 2 phone + 1 7-inch tablet + 1 10-inch tablet.
- [ ] **Feature graphic** 1024×500 PNG.
- [ ] **Short description** (80 chars) + **Full description** (4000 chars).

### Variáveis sensíveis (NUNCA commit em git)

- Stripe Secret Key — só no Vercel env var
- Google client IDs — OK ficar em app.json (não são secret)
- Stripe Publishable Key — OK ficar em app.json (é pública por design)
- Expo Project ID — OK ficar em app.json

---

## 7. Resumo do que substituir antes de publicar

| Arquivo | Linha | Substituir |
|---|---|---|
| `app.json` | `extra.googleClientIdIos` | Real iOS OAuth client ID |
| `app.json` | `extra.googleClientIdAndroid` | Real Android OAuth client ID |
| `app.json` | `extra.googleClientIdWeb` | Real Web OAuth client ID |
| `app.json` | `extra.stripePublishableKey` | `pk_live_...` (produção) |
| `app.json` | `extra.stripePaymentEndpoint` | URL do seu Vercel/Firebase |
| `app.json` | `extra.expoProjectId` | UUID do projeto em expo.dev |
| `app.json` | `extra.stripeMerchantId` | Apple Pay merchant ID (registrado na Apple) |
| `assets/images/icon.png` | — | Logo 1024×1024 |
| `assets/images/splash-icon.png` | — | Splash logo |
| `assets/images/android-icon-foreground.png` | — | Adaptive icon foreground |
| `app/privacy.tsx` | conteúdo | Texto legal revisado |
| `app/terms.tsx` | conteúdo | Texto legal revisado |
| (separado) | — | Hospedar Privacy + Terms HTML em `https://gbtl.app/privacy` e `/terms` |
| (separado) | — | Hospedar Account Deletion HTML em `https://gbtl.app/delete-account` |

---

## 8. Comandos úteis

```bash
# Dev (cache limpo — sempre depois de mudar tokens/colors/config)
npx expo start --clear

# Validar TypeScript
npx tsc --noEmit

# Prebuild nativo (gera /android e /ios pra inspecionar)
npx expo prebuild

# Build de produção
eas build --platform android --profile production
eas build --platform ios --profile production

# OTA update (depois do app já publicado)
eas update --branch production
```
