// src/data/mockProducts.ts

import type { Product } from '@/types'

// Unsplash CDN — direct photo IDs for clothing/fashion items. 3:4 portrait crop.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop&q=80&auto=format`

export const mockProducts: Product[] = [
  // ─── MEN ───────────────────────────────────────────────────────────────────

  {
    id: 'p001',
    name: "Men's Pullover Hoodie",
    price: 199,
    images: [
      img('1556821840-3a63f95609a7'),
      img('1620799140408-edc6dcb6d633'),
      img('1583743814966-8936f5b7be1a'),
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#1A1A1A', name: 'Black' },
      { hex: '#7AA3C4', name: 'Sky' },
      { hex: '#C7DCEA', name: 'Light Sky' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
      { label: 'XXL', available: true },
      { label: '3XL', available: true },
    ],
    category: 'men',
    description:
      'Crafted with premium materials, these cargo trousers blend comfort and style. The relaxed silhouette with a tapered leg makes them perfect for everyday wear.',
    rating: 4.8,
    reviewCount: 312,
    isFeatured: true,
  },

  {
    id: 'p002',
    name: 'Classic Oxford Shirt',
    price: 96,
    originalPrice: 128,
    images: [
      img('1620799140408-edc6dcb6d633'),
      img('1602810318383-e386cc2a3ccf'),
      img('1618354691373-d851c5c3a990'),
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'S',  available: true },
      { label: 'M',  available: true },
      { label: 'L',  available: true },
      { label: 'XL', available: false },
    ],
    category: 'men',
    description:
      'Tailored cotton Oxford with a clean cut and refined finish. Pairs effortlessly with chinos or denim.',
    rating: 4.5,
    reviewCount: 198,
    isSale: true,
  },

  {
    id: 'p003',
    name: 'Merino Wool Sweater',
    price: 185,
    images: [
      img('1576566588028-4147f3842f27'),
      img('1521572163474-6864f9cf17ab'),
      img('1611312449412-6cefac5dc3e4'),
    ],
    colors: [
      { hex: '#8B4513', name: 'Rust' },
      { hex: '#2F4F2F', name: 'Forest' },
      { hex: '#4A4A4A', name: 'Charcoal' },
    ],
    sizes: [
      { label: 'S',  available: true },
      { label: 'M',  available: false },
      { label: 'L',  available: true },
      { label: 'XL', available: true },
    ],
    category: 'men',
    description:
      'Extra-fine 18.5-micron Merino wool that regulates body temperature year-round. Classic crew-neck construction.',
    rating: 4.6,
    reviewCount: 87,
  },

  {
    id: 'p004',
    name: 'Classic Denim Jacket',
    price: 210,
    images: [
      img('1542272604-787c3835535d'),
      img('1551488831-00ddcb6c6bd3'),
      img('1591047139829-d91aecb6caea'),
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#2C3E50', name: 'Dark Navy' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'S', available: false },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: true },
    ],
    category: 'men',
    description:
      'Structured silhouette in premium selvedge denim from a heritage Japanese mill. Vintage copper rivets and tonal stitching.',
    rating: 4.7,
    reviewCount: 54,
    isNew: true,
  },

  // ─── WOMEN ─────────────────────────────────────────────────────────────────

  {
    id: 'p005',
    name: 'Soft Cotton Blouse',
    price: 195,
    images: [
      img('1485518882345-15568b007407'),
      img('1583744946564-b52ac1c389c8'),
      img('1551163943-3f6a855d1153'),
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
    ],
    category: 'women',
    description:
      'Lightweight cotton blouse with a fluid silhouette and adjustable tie at the waist. Effortless elegance for any occasion.',
    rating: 4.9,
    reviewCount: 421,
    isFeatured: true,
  },

  {
    id: 'p006',
    name: 'Linen Wrap Top',
    price: 88,
    originalPrice: 110,
    images: [
      img('1602810318383-e386cc2a3ccf'),
      img('1485518882345-15568b007407'),
      img('1583744946564-b52ac1c389c8'),
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
    ],
    category: 'women',
    description:
      'Pure linen wrap top with a relaxed drape and cropped length. Perfectly on-trend for warm-season dressing.',
    rating: 4.3,
    reviewCount: 265,
    isSale: true,
  },

  {
    id: 'p007',
    name: 'Cashmere Turtleneck',
    price: 240,
    images: [
      img('1551488831-00ddcb6c6bd3'),
      img('1551163943-3f6a855d1153'),
      img('1576566588028-4147f3842f27'),
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
    ],
    category: 'women',
    description:
      'Grade-A Mongolian cashmere in a slim ribbed turtleneck. Understated warmth without bulk.',
    rating: 4.8,
    reviewCount: 133,
    isNew: true,
  },

  {
    id: 'p008',
    name: 'Relaxed Knit Cardigan',
    price: 280,
    images: [
      img('1583744946564-b52ac1c389c8'),
      img('1551163943-3f6a855d1153'),
      img('1485518882345-15568b007407'),
    ],
    colors: [
      { hex: '#4A4A4A', name: 'Charcoal' },
      { hex: '#C8B89A', name: 'Camel' },
      { hex: '#F5F0E8', name: 'Ivory' },
    ],
    sizes: [
      { label: 'S', available: false },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: true },
    ],
    category: 'women',
    description:
      'Oversized single-breasted cardigan in a textured knit that softens beautifully with wear. Patch pockets keep the feel modern.',
    rating: 4.7,
    reviewCount: 78,
  },

  // ─── KIDS ──────────────────────────────────────────────────────────────────

  {
    id: 'p009',
    name: 'Organic Cotton Tee',
    price: 85,
    images: [
      img('1503944583220-79d8926ad5e2'),
      img('1622290319146-7b63df48a635'),
      img('1565693413579-8a73fcdf3eea'),
    ],
    colors: [
      { hex: '#F5F0E8', name: 'Ivory' },
      { hex: '#A8C5A0', name: 'Sage' },
      { hex: '#C4A0A0', name: 'Dusty Rose' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: false },
      { label: 'L', available: true },
    ],
    category: 'kids',
    description:
      'GOTS-certified organic cotton tee, gentle on sensitive skin. Easy-care and adorable.',
    rating: 4.6,
    reviewCount: 189,
    isFeatured: true,
  },

  {
    id: 'p010',
    name: 'Striped Knit Pullover',
    price: 72,
    originalPrice: 90,
    images: [
      img('1622290319146-7b63df48a635'),
      img('1565693413579-8a73fcdf3eea'),
      img('1503944583220-79d8926ad5e2'),
    ],
    colors: [
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#1A1A1A', name: 'Black' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: false },
    ],
    category: 'kids',
    description:
      'Soft cotton-acrylic blend pullover with playful stripes. Dropped shoulders for room to move.',
    rating: 4.4,
    reviewCount: 142,
    isSale: true,
  },

  {
    id: 'p011',
    name: 'Casual Long Sleeve',
    price: 95,
    images: [
      img('1565693413579-8a73fcdf3eea'),
      img('1503944583220-79d8926ad5e2'),
      img('1622290319146-7b63df48a635'),
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#C4A0A0', name: 'Dusty Rose' },
      { hex: '#F5F0E8', name: 'Ivory' },
    ],
    sizes: [
      { label: 'XS', available: false },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
    ],
    category: 'kids',
    description:
      'Soft long-sleeve cotton tee that layers beautifully under jackets or stands alone.',
    rating: 4.5,
    reviewCount: 67,
  },

  {
    id: 'p012',
    name: 'Classic Denim Overall',
    price: 68,
    images: [
      img('1622290319146-7b63df48a635'),
      img('1503944583220-79d8926ad5e2'),
      img('1565693413579-8a73fcdf3eea'),
    ],
    colors: [
      { hex: '#4A6FA5', name: 'Blue' },
      { hex: '#1A1A1A', name: 'Black' },
      { hex: '#C8B89A', name: 'Camel' },
    ],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: false },
    ],
    category: 'kids',
    description:
      'Durable mid-wash denim overalls with adjustable straps and side pockets. Built for non-stop play.',
    rating: 4.3,
    reviewCount: 93,
    isNew: true,
  },
]
