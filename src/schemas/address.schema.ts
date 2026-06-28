import { z } from 'zod'

export const addressSchema = z.object({
  label: z.string().min(2, 'Mínimo 2 caracteres'),
  recipient: z.string().min(3, 'Informe o destinatário'),
  zip: z.string().min(8, 'CEP inválido').max(9),
  street: z.string().min(2, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().min(2, 'UF inválida').max(2),
  country: z.string().min(2, 'País inválido'),
  phone: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>
