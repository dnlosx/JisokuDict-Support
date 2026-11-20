import type { Metadata } from 'next'

import { SupportView } from '@/components/SupportView'
import { alternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Soporte - Jisoku',
  description:
    'Respuestas a preguntas frecuentes sobre Jisoku: compras, sincronización con iCloud, estudio y búsqueda, y un formulario para contactar al desarrollador.',
  alternates: alternates('es', '/support'),
}

export default function SoportePage() {
  return <SupportView locale="es" />
}
