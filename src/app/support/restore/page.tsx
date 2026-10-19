import { redirect } from 'next/navigation'

// Old recovery links (/support/restore?t=<token>) from the retired ticket system.
// A server redirect drops the query string so the token doesn't follow along.
export default function RestorePage() {
  redirect('/support')
}
