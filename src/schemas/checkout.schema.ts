
import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName:   z.string().min(2, 'Name must be at least 2 characters'),
  address:    z.string().min(5, 'Please enter a full address'),
  city:       z.string().min(2, 'City required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry:     z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv:        z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
