'use client'

import { sendDemoQuery } from './sample'

/** A chip that types a query into the page's dictionary demo. */
export function DemoQueryButton({ query, className = '', children }: { query: string; className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={() => sendDemoQuery(query)} className={className}>
      {children ?? query}
    </button>
  )
}
