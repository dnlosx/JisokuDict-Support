'use client'

import { useCallback, useEffect, useId, useState } from 'react'

type Strokes = [outline: string, median: string][]

/**
 * Playback state for a kanji's strokes. `drawn` strokes are complete; while
 * `playing`, the next one is being brushed in.
 */
export function useStrokePlayback(count: number, resetKey: string) {
  const [drawn, setDrawn] = useState(count)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setDrawn(count)
    setPlaying(false)
  }, [count, resetKey])

  const play = useCallback(() => {
    setDrawn(0)
    setPlaying(count > 0)
  }, [count])

  const onStrokeEnd = useCallback(() => {
    setDrawn((d) => {
      const next = Math.min(count, d + 1)
      if (next >= count) setPlaying(false)
      return next
    })
  }, [count])

  const step = useCallback(
    (delta: number) => {
      setPlaying(false)
      setDrawn((d) => Math.max(0, Math.min(count, d + delta)))
    },
    [count],
  )

  return { drawn, playing, play, step, onStrokeEnd }
}

type Props = {
  strokes: Strokes
  drawn: number
  playing: boolean
  onStrokeEnd: () => void
  className?: string
  label: string
}

/**
 * Brush-style stroke order, as in the app: each stroke's centerline is drawn
 * with a wide pen and clipped to the stroke's outline.
 */
export function StrokeCanvas({ strokes, drawn, playing, onStrokeEnd, className = '', label }: Props) {
  const clipId = `stroke-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const current = playing && drawn < strokes.length ? strokes[drawn] : null
  const stepping = !playing && drawn > 0 && drawn < strokes.length

  return (
    <svg viewBox="0 0 1024 1024" role="img" aria-label={label} className={className}>
      <g stroke="#d9dbe3" strokeWidth={4} strokeDasharray="18 18">
        <line x1={512} y1={40} x2={512} y2={984} />
        <line x1={40} y1={512} x2={984} y2={512} />
      </g>
      <g fill="#dfe1e8">
        {strokes.map(([outline], i) => (
          <path key={i} d={outline} />
        ))}
      </g>
      {strokes.slice(0, drawn).map(([outline], i) => (
        <path key={i} d={outline} fill={stepping && i === drawn - 1 ? '#2f4fb6' : '#1a1b1e'} />
      ))}
      {current && (
        <g key={drawn}>
          <clipPath id={clipId}>
            <path d={current[0]} />
          </clipPath>
          <path
            d={current[1]}
            pathLength={1}
            clipPath={`url(#${clipId})`}
            className="stroke-draw"
            fill="none"
            stroke="#2f4fb6"
            strokeWidth={140}
            strokeLinecap="round"
            strokeLinejoin="round"
            onAnimationEnd={onStrokeEnd}
          />
        </g>
      )}
    </svg>
  )
}
