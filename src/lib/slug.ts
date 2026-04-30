import { customAlphabet } from 'nanoid'

const alphabet = '23456789abcdefghjkmnpqrstuvwxyz'
const generator = customAlphabet(alphabet, 12)

export function generateTicketSlug(): string {
  return generator()
}
