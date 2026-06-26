// src/data/mockProducts.ts

import type { Product } from '@/types'

export const mockProducts: Product[] = [
  // ─── MEN ───────────────────────────────────────────────────────────────────

  {
    id: 'p001',
    name: 'Premium Oxford Shirt',
    price: 120,
    images: [
      'https://picsum.photos/seed/gbtl-p001/400/500',
      'https://picsum.photos/seed/gbtl-p001b/400/500',
      'https://picsum.photos/seed/gbtl-p001c/400/500',
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#4A4A4A', name: 'Charcoal' },
    ],
    sizes: [
      { label: 'XS', available: false },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'men',
    description:
      'Crafted from 100% Egyptian cotton with a classic two-button collar, this premium Oxford shirt delivers refined comfort for any occasion. The relaxed tailored fit drapes elegantly without sacrificing ease of movement.',
    rating: 4.8,
    reviewCount: 312,
    isFeatured: true,
  },

  {
    id: 'p002',
    name: 'Tailored Chino Pants',
    price: 96,
    originalPrice: 128,
    images: [
      'https://picsum.photos/seed/gbtl-p002/400/500',
      'https://picsum.photos/seed/gbtl-p002b/400/500',
      'https://picsum.photos/seed/gbtl-p002c/400/500',
    ],
    colors: [
      { hex: '#C8B89A', name: 'Camel' },
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: false },
    ],
    category: 'men',
    description:
      'Slim-cut chinos tailored from a lightweight stretch-cotton blend that resists creasing throughout the day. A clean silhouette and subtle taper make these trousers equally at home at the office or weekend outings.',
    rating: 4.5,
    reviewCount: 198,
    isSale: true,
  },

  {
    id: 'p003',
    name: 'Merino Wool Sweater',
    price: 185,
    images: [
      'https://picsum.photos/seed/gbtl-p003/400/500',
      'https://picsum.photos/seed/gbtl-p003b/400/500',
      'https://picsum.photos/seed/gbtl-p003c/400/500',
    ],
    colors: [
      { hex: '#8B4513', name: 'Rust' },
      { hex: '#2F4F2F', name: 'Forest' },
      { hex: '#4A4A4A', name: 'Charcoal' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: true },
      { label: 'M',  available: false },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'men',
    description:
      'Woven from extra-fine 18.5-micron Merino wool for an incredibly soft hand-feel that regulates body temperature year-round. The classic crew-neck construction pairs seamlessly with casual and smart-casual looks.',
    rating: 4.6,
    reviewCount: 87,
  },

  {
    id: 'p004',
    name: 'Classic Denim Jacket',
    price: 210,
    images: [
      'https://picsum.photos/seed/gbtl-p004/400/500',
      'https://picsum.photos/seed/gbtl-p004b/400/500',
      'https://picsum.photos/seed/gbtl-p004c/400/500',
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#2C3E50', name: 'Dark Navy' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: false },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'men',
    description:
      'An enduring wardrobe staple reimagined with a structured silhouette and premium selvedge denim sourced from a heritage Japanese mill. Vintage-inspired copper rivets and tonal stitching complete the look.',
    rating: 4.7,
    reviewCount: 54,
    isNew: true,
  },

  // ─── WOMEN ─────────────────────────────────────────────────────────────────

  {
    id: 'p005',
    name: 'Silk Wrap Dress',
    price: 195,
    images: [
      'https://picsum.photos/seed/gbtl-p005/400/500',
      'https://picsum.photos/seed/gbtl-p005b/400/500',
      'https://picsum.photos/seed/gbtl-p005c/400/500',
    ],
    colors: [
      { hex: '#C4A0A0', name: 'Dusty Rose' },
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'XS', available: false },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'women',
    description:
      'Fluid wrap silhouette cut from pure 19-momme silk charmeuse that drapes beautifully over every curve. Adjustable tie belt and a V-neckline lend effortless elegance to both daytime and evening occasions.',
    rating: 4.9,
    reviewCount: 421,
    isFeatured: true,
  },

  {
    id: 'p006',
    name: 'High-Waist Linen Trousers',
    price: 88,
    originalPrice: 110,
    images: [
      'https://picsum.photos/seed/gbtl-p006/400/500',
      'https://picsum.photos/seed/gbtl-p006b/400/500',
      'https://picsum.photos/seed/gbtl-p006c/400/500',
    ],
    colors: [
      { hex: '#C8B89A', name: 'Camel' },
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#2F4F2F', name: 'Forest' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: false },
      { label: 'XL', available: true },
    ],
    category: 'women',
    description:
      'Breathable pure-linen wide-leg trousers with a high-rise waistband and elasticated back for all-day comfort. The relaxed drape and cropped length are perfectly on-trend for warm-season dressing.',
    rating: 4.3,
    reviewCount: 265,
    isSale: true,
  },

  {
    id: 'p007',
    name: 'Cashmere Turtleneck',
    price: 240,
    images: [
      'https://picsum.photos/seed/gbtl-p007/400/500',
      'https://picsum.photos/seed/gbtl-p007b/400/500',
      'https://picsum.photos/seed/gbtl-p007c/400/500',
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#C4A0A0', name: 'Dusty Rose' },
      { hex: '#4A4A4A', name: 'Charcoal' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: false },
    ],
    category: 'women',
    description:
      'Luxuriously soft Grade-A Mongolian cashmere in a slim ribbed turtleneck construction that provides understated warmth without bulk. An essential cold-weather investment piece that only improves with every wear.',
    rating: 4.8,
    reviewCount: 133,
    isNew: true,
  },

  {
    id: 'p008',
    name: 'Relaxed Linen Blazer',
    price: 280,
    images: [
      'https://picsum.photos/seed/gbtl-p008/400/500',
      'https://picsum.photos/seed/gbtl-p008b/400/500',
      'https://picsum.photos/seed/gbtl-p008c/400/500',
    ],
    colors: [
      { hex: '#4A4A4A', name: 'Charcoal' },
      { hex: '#C8B89A', name: 'Camel' },
      { hex: '#F5F0E8', name: 'Ivory' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: false },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'women',
    description:
      'An oversized single-breasted blazer tailored from a textured linen blend that softens beautifully with wear. The deconstructed interior and patch pockets keep the feel light and modern season after season.',
    rating: 4.7,
    reviewCount: 78,
  },

  // ─── KIDS ──────────────────────────────────────────────────────────────────

  {
    id: 'p009',
    name: 'Organic Cotton Set',
    price: 85,
    images: [
      'https://picsum.photos/seed/gbtl-p009/400/500',
      'https://picsum.photos/seed/gbtl-p009b/400/500',
      'https://picsum.photos/seed/gbtl-p009c/400/500',
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#A8C5A0', name: 'Sage' },
      { hex: '#C4A0A0', name: 'Dusty Rose' },
    ],
    sizes: [
      { label: '2Y',  available: true },
      { label: '4Y',  available: true },
      { label: '6Y',  available: false },
      { label: '8Y',  available: true },
      { label: '10Y', available: true },
    ],
    category: 'kids',
    description:
      'A matching top-and-bottom set crafted from 100% GOTS-certified organic cotton that is gentle on sensitive skin. Easy-care fabric and snap closures make dressing little ones effortless and adorable.',
    rating: 4.6,
    reviewCount: 189,
    isFeatured: true,
  },

  {
    id: 'p010',
    name: 'Mini Parka Jacket',
    price: 72,
    originalPrice: 90,
    images: [
      'https://picsum.photos/seed/gbtl-p010/400/500',
      'https://picsum.photos/seed/gbtl-p010b/400/500',
      'https://picsum.photos/seed/gbtl-p010c/400/500',
    ],
    colors: [
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#8B4513', name: 'Rust' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: '2Y',  available: true },
      { label: '4Y',  available: true },
      { label: '6Y',  available: true },
      { label: '8Y',  available: true },
      { label: '10Y', available: false },
    ],
    category: 'kids',
    description:
      'A water-resistant ripstop parka with a cozy faux-sherpa lining that keeps active kids warm through the coldest days. Elasticated cuffs, an adjustable drawstring hem, and reflective piping make it as practical as it is stylish.',
    rating: 4.4,
    reviewCount: 142,
    isSale: true,
  },

  {
    id: 'p011',
    name: 'Striped Knit Pullover',
    price: 95,
    images: [
      'https://picsum.photos/seed/gbtl-p011/400/500',
      'https://picsum.photos/seed/gbtl-p011b/400/500',
      'https://picsum.photos/seed/gbtl-p011c/400/500',
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#C4A0A0', name: 'Dusty Rose' },
      { hex: '#F5F0E8', name: 'Ivory' },
    ],
    sizes: [
      { label: '2Y',  available: false },
      { label: '4Y',  available: true },
      { label: '6Y',  available: true },
      { label: '8Y',  available: true },
      { label: '10Y', available: true },
    ],
    category: 'kids',
    description:
      'A playful engineered-stripe pullover knitted from a soft cotton-acrylic blend that holds its shape wash after wash. Dropped shoulders and a relaxed fit give kids room to move freely all day long.',
    rating: 4.5,
    reviewCount: 67,
  },

  {
    id: 'p012',
    name: 'Classic Denim Shorts',
    price: 68,
    images: [
      'https://picsum.photos/seed/gbtl-p012/400/500',
      'https://picsum.photos/seed/gbtl-p012b/400/500',
      'https://picsum.photos/seed/gbtl-p012c/400/500',
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#1A1A1A', name: 'Black' },
      { hex: '#C8B89A', name: 'Camel' },
    ],
    sizes: [
      { label: '2Y',  available: true },
      { label: '4Y',  available: true },
      { label: '6Y',  available: true },
      { label: '8Y',  available: false },
      { label: '10Y', available: true },
    ],
    category: 'kids',
    description:
      'Durable mid-wash denim shorts with a flexible elasticated waistband and deep side pockets built for non-stop play. Classic five-pocket styling and reinforced knees ensure they hold up to every adventure.',
    rating: 4.3,
    reviewCount: 93,
    isNew: true,
  },
]
