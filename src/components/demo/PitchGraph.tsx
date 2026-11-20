import { pitchContour } from '@/lib/demo/kana'

type Props = {
  reading: string
  pattern: number
  /** px per mora */
  step?: number
  className?: string
  /** draw the particle that follows the word, where heiban and odaka differ */
  particle?: boolean
}

/** The app's pitch graph: a dot per mora, high or low, joined by a line. */
export function PitchGraph({ reading, pattern, step = 26, className = '', particle = false }: Props) {
  const contour = pitchContour(reading, pattern)
  const points = contour.map((c, i) => ({ x: step / 2 + i * step, y: c.high ? 6 : 22, ...c }))
  const tail = particle
    ? { x: step / 2 + contour.length * step, y: pattern === 0 || pattern > contour.length ? 6 : 22 }
    : null
  const width = (contour.length + (tail ? 1 : 0)) * step
  const line = [...points, ...(tail ? [tail] : [])].map((p) => `${p.x},${p.y}`).join(' ')
  const spoken = contour.map((c) => `${c.mora} ${c.high ? '↑' : '↓'}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} 52`}
      width={width}
      height={52}
      role="img"
      aria-label={`Pitch accent: ${spoken}`}
      className={`shrink-0 text-app ${className}`}
    >
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r={3} fill="currentColor" />
      ))}
      {tail && <circle cx={tail.x} cy={tail.y} r={3} fill="white" stroke="currentColor" strokeWidth={1.6} />}
      {points.map((p) => (
        <text key={p.x} x={p.x} y={46} textAnchor="middle" fontSize={contour.some((c) => c.mora.length > 1) ? 13 : 15} fill="#1a1b1e" className="font-japanese">
          {p.mora}
        </text>
      ))}
    </svg>
  )
}
