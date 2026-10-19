import { z } from 'zod'

import { FEEDBACK_TOPICS } from '@/db/schema'

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null))

export const createFeedbackSchema = z.object({
  topic: z.enum(FEEDBACK_TOPICS),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least a sentence.')
    .max(5000, 'Message is too long (5,000 characters max).'),
  email: z
    .union([z.literal(''), z.string().trim().email().max(254)])
    .optional()
    .transform((v) => (v ? v.toLowerCase() : null)),
  device: optionalText(100),
  appVersion: optionalText(30),
  turnstileToken: z.string().min(1).max(2048),
})

export const adminAuthSchema = z.object({
  password: z.string().min(1).max(200),
})

export const adminUpdateFeedbackSchema = z.object({
  handled: z.boolean(),
})
