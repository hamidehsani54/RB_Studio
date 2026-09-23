import Image from 'next/image'
import type { Media } from '@/payload-types'
import { asMedia, cx } from '@/lib/utils'

type Props = {
  media: unknown
  /** Responsive sizes hint, e.g. "(min-width: 900px) 50vw, 100vw" */
  sizes?: string
  priority?: boolean
  className?: string
  /** Fill the parent (parent needs a size / aspect-ratio) — default true */
  fill?: boolean
  alt?: string
}

/**
 * Responsive, lazy-loaded photograph.
 * Next.js serves AVIF/WebP in the right size for each screen and caches the result,
 * with a tiny blurred preview while loading. The focal point set in the admin is respected.
 */
export function Img({ media, sizes = '100vw', priority, className, fill = true, alt }: Props) {
  const m = asMedia(media) as Media | null
  if (!m?.url) return null
  const objectPosition =
    typeof m.focalX === 'number' && typeof m.focalY === 'number' ? `${m.focalX}% ${m.focalY}%` : '50% 50%'
  const common = {
    src: m.url,
    alt: alt ?? m.alt ?? '',
    sizes,
    priority,
    quality: 80,
    className: cx(className),
    placeholder: m.blurDataURL ? ('blur' as const) : ('empty' as const),
    blurDataURL: m.blurDataURL ?? undefined,
  }
  if (fill) return <Image {...common} fill style={{ objectFit: 'cover', objectPosition }} />
  return <Image {...common} width={m.width ?? 1600} height={m.height ?? 1067} style={{ width: '100%', height: 'auto' }} />
}

/** Aspect-ratio frame with an image inside. */
export function Frame({
  media,
  ratio,
  sizes,
  priority,
  hover,
  reveal = true,
  className,
  natural,
}: {
  media: unknown
  ratio?: 'landscape' | 'portrait' | 'tall' | 'wide' | 'cinema' | 'square'
  sizes?: string
  priority?: boolean
  hover?: boolean
  reveal?: boolean
  className?: string
  /** Use the image's own proportions */
  natural?: boolean
}) {
  const m = asMedia(media)
  if (!m) return null
  const style = natural && m.width && m.height ? { aspectRatio: `${m.width} / ${m.height}` } : undefined
  return (
    <div
      className={cx('frame', ratio && `ratio-${ratio}`, hover && 'frame--hover', className)}
      style={style}
      data-reveal={reveal ? 'image' : undefined}
    >
      <Img media={m} sizes={sizes} priority={priority} />
    </div>
  )
}

export { isPortrait } from '@/lib/story'
