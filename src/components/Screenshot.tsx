/**
 * iPhone Duo simulator screenshots in a dark device bezel.
 * - portrait: unfolded, held upright (985×1400)
 * - open:     unfolded, landscape (1600×1125)
 * - folded:   outer display (893×1300)
 */
const SIZES = {
  portrait: { width: 985, height: 1400, radius: 'rounded-[1.6rem]' },
  open: { width: 1600, height: 1125, radius: 'rounded-[1.4rem]' },
  folded: { width: 893, height: 1300, radius: 'rounded-[1.7rem]' },
} as const

type Props = {
  src: string
  alt?: string
  className?: string
  priority?: boolean
  variant?: keyof typeof SIZES
}

export function Screenshot({ src, alt = '', className = '', priority = false, variant = 'portrait' }: Props) {
  const { width, height, radius } = SIZES[variant]
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      className={`${radius} border-[6px] border-ink-900 bg-white shadow-xl ${className}`}
    />
  )
}
