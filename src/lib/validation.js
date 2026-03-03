import { z } from 'zod'

export const calculatorSchema = z.object({
  groupId: z.string().uuid('Please select a valid group'),
  marks: z.record(z.number().min(0).max(100, 'Marks must be 0-100')),
  categoryId: z.string().uuid('Please select a valid category')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const courseFilterSchema = z.object({
  streamId: z.string().optional(),
  searchTerm: z.string().optional()
})

export const validateCalculatorInput = (data) => {
  try {
    return { valid: true, data: calculatorSchema.parse(data) }
  } catch (error) {
    return { valid: false, errors: error.flatten() }
  }
}
