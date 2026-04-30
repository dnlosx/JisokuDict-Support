'use client'

import type { Element, Root } from 'hast'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const schema = {
  ...defaultSchema,
  tagNames: [
    'p',
    'strong',
    'em',
    'del',
    'code',
    'pre',
    'blockquote',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'br',
    'hr',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [['href', /^https?:\/\//i], ['title']],
    img: [['src', /^https:\/\//i], ['alt'], ['title']],
  },
  protocols: { href: ['http', 'https', 'mailto'], src: ['https'] },
}

type Props = {
  children: string
  className?: string
}

export function Markdown({ children, className }: Props) {
  return (
    <div
      className={
        className ??
        'prose-jsk text-ink-800 leading-relaxed [&_a]:text-sakura-600 [&_a]:underline [&_code]:text-sm [&_code]:bg-ink-50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-ink-50 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-4 [&_blockquote]:border-ink-200 [&_blockquote]:pl-3 [&_blockquote]:text-ink-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h3]:font-semibold [&_h3]:mt-2 [&_p]:mb-3 [&_img]:max-w-full [&_img]:rounded'
      }
    >
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema as unknown as Root]]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
          ),
          img: ({ node: _node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img {...props} loading="lazy" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export type { Element }
