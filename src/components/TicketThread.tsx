import { Markdown } from './Markdown'

type Message = {
  id: string
  authorRole: 'user' | 'admin'
  authorDisplayName: string
  body: string
  createdAt: Date
}

type Props = {
  messages: Message[]
}

const FMT = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function TicketThread({ messages }: Props) {
  return (
    <ol className="space-y-4">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`rounded-lg border p-4 ${
            m.authorRole === 'admin'
              ? 'border-sakura-200 bg-sakura-50/50'
              : 'border-ink-100 bg-white'
          }`}
        >
          <header className="flex items-baseline justify-between gap-3 mb-3">
            <span className="text-sm font-medium text-ink-900">{m.authorDisplayName}</span>
            <time className="text-xs text-ink-500" dateTime={new Date(m.createdAt).toISOString()}>
              {FMT.format(new Date(m.createdAt))}
            </time>
          </header>
          <Markdown>{m.body}</Markdown>
        </li>
      ))}
    </ol>
  )
}
