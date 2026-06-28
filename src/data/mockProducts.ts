import type { Product } from '@/types'

/**
 * Catálogo de polos lisas (sem estampa).
 * Preços em BRL — faixa R$ 69 a R$ 89.
 * Imagens hospedadas no Unsplash (substituir por CDN próprio em produção,
 * ver [assets/images/products/README.md]).
 */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop&q=80&auto=format`

// Pool de fotos de polos lisas verificadas
const POLO = {
  greenOnWhite: img('1586363129094-d7a38564fae1'),
  black: img('1625910513413-c23b8bb81cba'),
  grayOnBlue: img('1625910513394-ea511bed44ca'),
  grayOnWhite: img('1586363090844-099253d6a1cb'),
  plainNeutral: img('1581655353564-df123a1eb820'),
  plainStudio: img('1671438118097-479e63198629'),
  whiteFlat: img('1622622016645-7b7065e7c129'),
  purpleDetail: img('1619792423784-6c298b30299a'),
  lightBlueModel: img('1775306413232-fecd45367613'),
} as const

// Paletas de cores padrão para polos lisas
const PALETTE = {
  white: { hex: '#F5F5F2', name: 'Branco' },
  ivory: { hex: '#F0EBE0', name: 'Off-white' },
  black: { hex: '#1A1A1A', name: 'Preto' },
  navy: { hex: '#22324A', name: 'Marinho' },
  gray: { hex: '#7C8385', name: 'Cinza' },
  charcoal: { hex: '#3A3F42', name: 'Grafite' },
  sage: { hex: '#8FB088', name: 'Verde Sálvia' },
  sky: { hex: '#9CC0DD', name: 'Azul Céu' },
  burgundy: { hex: '#7A2E2A', name: 'Vinho' },
  beige: { hex: '#C8B89A', name: 'Bege' },
  rose: { hex: '#C49797', name: 'Rosa Antigo' },
  forest: { hex: '#2F4F2F', name: 'Verde Floresta' },
} as const

const ADULT_SIZES = [
  { label: 'PP', available: true },
  { label: 'P', available: true },
  { label: 'M', available: true },
  { label: 'G', available: true },
  { label: 'GG', available: true },
] as const

const KIDS_SIZES = [
  { label: '4', available: true },
  { label: '6', available: true },
  { label: '8', available: true },
  { label: '10', available: true },
  { label: '12', available: true },
] as const

export const mockProducts: Product[] = [
  // ============ MASCULINO (5 polos) ============
  {
    id: 'p001',
    name: 'Polo Piquet Premium',
    price: 89,
    images: [POLO.whiteFlat, POLO.plainNeutral, POLO.greenOnWhite],
    colors: [PALETTE.white, PALETTE.navy, PALETTE.black, PALETTE.sage],
    sizes: [...ADULT_SIZES],
    category: 'men',
    description:
      'Polo lisa em piquet de algodão 100%, gramatura 220 g/m², com gola tradicional canelada e abertura com dois botões em madrepérola. Caimento clássico com leve folga no busto, manga curta ajustada e barra reta. Peça atemporal feita para durar — lavagem na máquina libera, sem perda de cor.',
    rating: 4.8,
    reviewCount: 312,
    isFeatured: true,
  },
  {
    id: 'p002',
    name: 'Polo Algodão Pima',
    price: 85,
    images: [POLO.greenOnWhite, POLO.plainStudio, POLO.whiteFlat],
    colors: [PALETTE.sage, PALETTE.ivory, PALETTE.navy, PALETTE.forest],
    sizes: [...ADULT_SIZES],
    category: 'men',
    description:
      'Polo lisa confeccionada em algodão Pima peruano, conhecido pela fibra extra-longa que entrega toque acetinado e cor durável. Modelagem regular, gola canelada com punho contrastante discreto e fenda lateral na barra. Peça de elevada respirabilidade — ideal para o dia inteiro.',
    rating: 4.7,
    reviewCount: 198,
  },
  {
    id: 'p003',
    name: 'Polo Slim Marinho',
    price: 79,
    originalPrice: 99,
    images: [POLO.plainNeutral, POLO.grayOnBlue, POLO.black],
    colors: [PALETTE.navy, PALETTE.black, PALETTE.charcoal, PALETTE.white],
    sizes: [
      { label: 'PP', available: true },
      { label: 'P', available: true },
      { label: 'M', available: true },
      { label: 'G', available: false },
      { label: 'GG', available: true },
    ],
    category: 'men',
    description:
      'Polo lisa com corte slim e tecido piquet stretch (96% algodão + 4% elastano) que acompanha o movimento sem amassar. Gola e punhos canelados com acabamento contrastante. Marinho profundo que combina com qualquer alfaiataria casual.',
    rating: 4.6,
    reviewCount: 246,
    isSale: true,
  },
  {
    id: 'p004',
    name: 'Polo Clássica Preta',
    price: 89,
    images: [POLO.black, POLO.plainStudio, POLO.grayOnBlue],
    colors: [PALETTE.black, PALETTE.charcoal, PALETTE.navy],
    sizes: [...ADULT_SIZES],
    category: 'men',
    description:
      'Polo lisa preta em piquet pesado (250 g/m²) que mantém o caimento mesmo após muitas lavagens. Gola estruturada com entretela, fenda lateral discreta e identificação interna em jacquard. Versátil para uso com jeans, alfaiataria leve ou bermuda chino.',
    rating: 4.9,
    reviewCount: 421,
    isFeatured: true,
  },
  {
    id: 'p005',
    name: 'Polo Mescla Cinza',
    price: 75,
    images: [POLO.grayOnWhite, POLO.plainNeutral, POLO.greenOnWhite],
    colors: [PALETTE.gray, PALETTE.charcoal, PALETTE.navy, PALETTE.ivory],
    sizes: [...ADULT_SIZES],
    category: 'men',
    description:
      'Polo lisa em malha mesclada que dá um aspecto sofisticado ao visual. Algodão penteado com toque macio, gola e mangas com acabamento ribana fino. Corte reto, ideal para quem prefere conforto sem perder o caimento estruturado.',
    rating: 4.5,
    reviewCount: 132,
  },

  // ============ FEMININO (4 polos) ============
  {
    id: 'p006',
    name: 'Polo Feminina Manga Curta',
    price: 79,
    images: [POLO.whiteFlat, POLO.greenOnWhite, POLO.purpleDetail],
    colors: [PALETTE.white, PALETTE.rose, PALETTE.sage, PALETTE.navy],
    sizes: [...ADULT_SIZES],
    category: 'women',
    description:
      'Polo lisa feminina em piquet de algodão leve (190 g/m²), com modelagem que valoriza a silhueta sem apertar. Gola canelada com abertura de três botões em madrepérola, manga curta com leve estreitamento e barra arredondada. Caimento elegante.',
    rating: 4.8,
    reviewCount: 287,
    isFeatured: true,
  },
  {
    id: 'p007',
    name: 'Polo Slim Feminina',
    price: 85,
    images: [POLO.purpleDetail, POLO.plainStudio, POLO.black],
    colors: [PALETTE.black, PALETTE.burgundy, PALETTE.navy, PALETTE.gray],
    sizes: [...ADULT_SIZES],
    category: 'women',
    description:
      'Polo lisa com pences discretas na frente e nas costas para um caimento ajustado no corpo. Tecido piquet stretch garante elasticidade e bom retorno. Punhos canelados com elástico interno. Ideal para o trabalho com um blazer ou casualmente com jeans.',
    rating: 4.7,
    reviewCount: 154,
    isNew: true,
  },
  {
    id: 'p008',
    name: 'Polo Rosa Antigo',
    price: 69,
    originalPrice: 89,
    images: [POLO.purpleDetail, POLO.whiteFlat, POLO.plainNeutral],
    colors: [PALETTE.rose, PALETTE.ivory, PALETTE.sage],
    sizes: [
      { label: 'PP', available: true },
      { label: 'P', available: true },
      { label: 'M', available: false },
      { label: 'G', available: true },
      { label: 'GG', available: true },
    ],
    category: 'women',
    description:
      'Polo lisa em tom rosa antigo, cor exclusiva tingida com pigmentos low-impact. Algodão penteado fino, gola canelada bicolor sutil e manga curta com bainha rolada. Perfeita para combinar com saias plissadas ou alfaiataria off-white.',
    rating: 4.6,
    reviewCount: 198,
    isSale: true,
  },
  {
    id: 'p009',
    name: 'Polo Verde Sálvia',
    price: 75,
    images: [POLO.greenOnWhite, POLO.plainStudio, POLO.whiteFlat],
    colors: [PALETTE.sage, PALETTE.forest, PALETTE.ivory, PALETTE.beige],
    sizes: [...ADULT_SIZES],
    category: 'women',
    description:
      'Polo lisa em verde sálvia — tendência da temporada — com caimento solto e barra ligeiramente cropped. Piquet leve (180 g/m²) ideal para o calor. Gola e abertura tradicionais, sem detalhes contrastantes para uma estética minimalista.',
    rating: 4.7,
    reviewCount: 102,
  },

  // ============ INFANTIL (3 polos) ============
  {
    id: 'p010',
    name: 'Polo Infantil Branca',
    price: 69,
    images: [POLO.whiteFlat, POLO.greenOnWhite, POLO.plainNeutral],
    colors: [PALETTE.white, PALETTE.sky, PALETTE.sage],
    sizes: [...KIDS_SIZES],
    category: 'kids',
    description:
      'Polo lisa infantil em algodão penteado macio, com gola canelada reforçada para aguentar o uso pesado da rotina escolar. Reforço duplo na costura dos ombros, fácil de lavar e de passar. Ótimo encaixe entre 4 e 12 anos.',
    rating: 4.7,
    reviewCount: 189,
    isFeatured: true,
  },
  {
    id: 'p011',
    name: 'Polo Infantil Marinho',
    price: 72,
    images: [POLO.plainNeutral, POLO.grayOnBlue, POLO.greenOnWhite],
    colors: [PALETTE.navy, PALETTE.white, PALETTE.gray],
    sizes: [
      { label: '4', available: true },
      { label: '6', available: true },
      { label: '8', available: true },
      { label: '10', available: false },
      { label: '12', available: true },
    ],
    category: 'kids',
    description:
      'Polo lisa infantil marinho, peça curinga para uniforme escolar ou look casual. Piquet de algodão com tingimento color-fast (não desbota nas primeiras lavagens). Punhos discretos, sem aplicações que incomodam o movimento.',
    rating: 4.5,
    reviewCount: 142,
  },
  {
    id: 'p012',
    name: 'Polo Infantil Cinza',
    price: 75,
    images: [POLO.grayOnWhite, POLO.plainStudio, POLO.whiteFlat],
    colors: [PALETTE.gray, PALETTE.navy, PALETTE.white],
    sizes: [...KIDS_SIZES],
    category: 'kids',
    description:
      'Polo lisa infantil em cinza mesclado com toque ultrasoft, ideal para peles sensíveis. Modelagem com leve folga para acomodar o crescimento. Costuras planas internas para evitar atrito, gola canelada que mantém o formato.',
    rating: 4.6,
    reviewCount: 93,
    isNew: true,
  },
]
