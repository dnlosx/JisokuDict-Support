import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Jisoku - Diccionario de japonés para iOS',
  description:
    'Un diccionario japonés-inglés rápido y sin conexión, con más de 200,000 entradas. Búsqueda inteligente, romaji, consulta de kanji y sincronización con iCloud.',
  openGraph: {
    title: 'Jisoku - Diccionario de japonés para iOS',
    description: 'Un diccionario japonés-inglés rápido y sin conexión, con más de 200,000 entradas.',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body className="bg-white text-ink-900 antialiased">{children}</body>
    </html>
  )
}
