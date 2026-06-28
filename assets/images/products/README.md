# Imagens de produtos

Esta pasta abriga as fotos dos produtos do catálogo GBTL.

## Estado atual

Hoje o app usa URLs do **Unsplash** (CDN público, fotos de polos lisas) referenciadas em [`src/data/mockProducts.ts`](../../../src/data/mockProducts.ts). Isso é OK para desenvolvimento e demo, mas **não para produção**, porque:

1. Você não controla os direitos das imagens.
2. Unsplash pode deletar/mover a foto a qualquer momento → quebra silenciosa do catálogo.
3. Não há otimização CDN regional (Brasil).
4. Não há fallback / blurhash.

## Antes do lançamento

1. **Faça o shooting do catálogo real** (ou use o serviço do fornecedor).
2. **Hospede em CDN dedicado**:
   - [Cloudinary](https://cloudinary.com) (recomendado — transformações on-the-fly: `f_auto,q_auto,w_600,h_750`)
   - [Imgix](https://imgix.com)
   - [Firebase Storage + CDN](https://firebase.google.com/docs/storage)
   - Self-hosted via Cloudflare R2 + Cloudflare Images
3. **Substitua as URLs** em `mockProducts.ts` (ou idealmente: mova produtos para Firestore/API e remova mock).
4. **Gere blurhash** para cada imagem (`npm i blurhash` no backend) e armazene junto com o produto. Use no `<Image placeholder={{ blurhash }}>` em `expo-image`.

## Convenções para os arquivos locais

Se for hospedar imagens junto com o app (não recomendado para catálogos grandes, mas OK para fotos de marca/promoções):

- **Formato**: `.webp` (menor) ou `.jpg` (compat). PNG só se precisar de transparência.
- **Tamanho master**: 1200×1500 (4:5).
- **Compressão**: q=80 a q=85.
- **Nomenclatura**: `{productId}-{n}.webp`. Ex: `p001-1.webp`, `p001-2.webp`.
- **Importar**: `require('@/assets/images/products/p001-1.webp')` ou via Asset module do Expo.

## Imagens atualmente em uso (Unsplash)

Todas são fotos públicas de polos lisas (sem estampa) sob a [licença Unsplash](https://unsplash.com/license):

| ID Unsplash                      | Descrição                            |
| -------------------------------- | ------------------------------------ |
| photo-1586363129094-d7a38564fae1 | Polo verde sálvia em mesa branca     |
| photo-1625910513413-c23b8bb81cba | Polo preta                           |
| photo-1625910513394-ea511bed44ca | Polo cinza em tecido azul            |
| photo-1586363090844-099253d6a1cb | Polo cinza em mesa branca            |
| photo-1581655353564-df123a1eb820 | Polo lisa neutra                     |
| photo-1671438118097-479e63198629 | Polo lisa                            |
| photo-1622622016645-7b7065e7c129 | Polo lisa branca                     |
| photo-1619792423784-6c298b30299a | Tecido roxo (detalhe gola)           |
| photo-1775306413232-fecd45367613 | Modelo masculino com polo azul claro |

> **Nota legal**: a Licença Unsplash permite uso comercial gratuito sem atribuição obrigatória, mas é uma boa prática creditar o fotógrafo. Para uso prolongado em produção, considere comprar licenças exclusivas ou produzir suas próprias fotos.
