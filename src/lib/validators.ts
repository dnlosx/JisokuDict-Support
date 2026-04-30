import { z } from 'zod'

export const usernameSchema = z
  .string()
  .trim()
  .min(2, 'Username must be at least 2 characters')
  .max(60, 'Username must be at most 60 characters')
  .regex(/^[\p{L}\p{N} _.\-]+$/u, 'Username may contain letters, numbers, spaces, underscores, dots, and dashes only')

export const ticketCategorySchema = z.enum(['bug', 'feature', 'account', 'other'])

export const ticketTitleSchema = z.string().trim().min(3).max(200)

export const messageBodySchema = z
  .string()
  .min(1)
  .max(8 * 1024, 'Message is too long (8 KB max)')

export const turnstileTokenSchema = z.string().min(1).max(2048)

export const createTicketSchema = z.object({
  title: ticketTitleSchema,
  category: ticketCategorySchema,
  body: messageBodySchema,
  username: usernameSchema,
  turnstileToken: turnstileTokenSchema,
})

export const replyMessageSchema = z.object({
  body: messageBodySchema,
})

export const adminAuthSchema = z.object({
  password: z.string().min(1).max(200),
})

export const adminUpdateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  visibility: z.enum(['private', 'public']).optional(),
})
