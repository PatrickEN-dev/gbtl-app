import { z } from 'zod'

export const productColorSchema = z.object({
  hex: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'invalid hex'),
  name: z.string().min(1).max(40),
})

export const productSizeSchema = z.object({
  label: z.string().min(1).max(6),
  available: z.boolean(),
})

export const productSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  price: z.number().nonnegative().finite().max(100_000),
  originalPrice: z.number().nonnegative().finite().max(100_000).optional(),
  images: z.array(z.string().url()).min(1).max(10),
  colors: z.array(productColorSchema).min(1).max(20),
  sizes: z.array(productSizeSchema).min(1).max(40),
  category: z.enum(['men', 'women', 'kids']),
  description: z.string().min(1).max(2000),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative().max(1_000_000),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
})

export const productListSchema = z.array(productSchema).max(500)

export const reviewSchema = z.object({
  id: z.string().min(1).max(64),
  productId: z.string().min(1).max(64),
  userId: z.string().min(1).max(64),
  userName: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(1).max(2000),
  createdAt: z.number().int().nonnegative(),
})

export const reviewListSchema = z.array(reviewSchema).max(200)

export const orderSchema = z.object({
  id: z.string().min(1).max(64),
  userId: z.string().min(1).max(64),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'canceled', 'refunded']),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  currency: z.string().length(3),
  createdAt: z.number().int().nonnegative(),
})

export const stripeIntentResponseSchema = z.object({
  clientSecret: z.string().min(10).max(500),
  ephemeralKey: z.string().min(10).max(500).optional(),
  customer: z.string().min(1).max(120).optional(),
  paymentIntentId: z.string().min(1).max(120).optional(),
})

export const viaCepResponseSchema = z.object({
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  localidade: z.string().optional(),
  uf: z.string().optional(),
  erro: z.union([z.boolean(), z.string()]).optional(),
})

export const googleProfileSchema = z.object({
  id: z.string().min(1).max(120),
  email: z.string().email().max(320),
  name: z.string().min(1).max(120),
  picture: z.string().url().max(2048).optional(),
})
