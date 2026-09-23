import type { Media } from '@/payload-types'
import { asMedia } from './utils'

export type Chapter = { heading?: string | null; text: string; afterImage?: number | null; id?: string | null }

export type Row =
  | { kind: 'full' | 'inset' | 'portrait-left' | 'portrait-right' | 'pair'; images: Media[] }
  | { kind: 'chapter'; chapter: Chapter }

export const isPortrait = (media: unknown) => {
  const m = asMedia(media)
  return Boolean(m?.width && m?.height && m.height > m.width * 1.05)
}

/**
 * Composes an editorial layout automatically from each photograph's proportions:
 * two portraits sit side by side, landscapes alternate between full-bleed and inset,
 * single portraits alternate left and right. Text passages are woven in between.
 */
export function composeStory(images: Media[], chapters: Chapter[] = []): Row[] {
  const rows: Row[] = []
  const pending = [...chapters].sort((a, b) => (a.afterImage ?? 0) - (b.afterImage ?? 0))
  const flushChapters = (count: number) => {
    while (pending.length && (pending[0].afterImage ?? 0) <= count) rows.push({ kind: 'chapter', chapter: pending.shift()! })
  }
  let landscapeCount = 0
  let portraitSide = 0
  let i = 0
  flushChapters(0)
  while (i < images.length) {
    const current = images[i]
    const next = images[i + 1]
    const nextChapterAt = pending[0]?.afterImage ?? Infinity
    if (isPortrait(current) && next && isPortrait(next) && i + 1 < nextChapterAt) {
      rows.push({ kind: 'pair', images: [current, next] })
      i += 2
    } else if (isPortrait(current)) {
      rows.push({ kind: portraitSide++ % 2 === 0 ? 'portrait-left' : 'portrait-right', images: [current] })
      i += 1
    } else {
      rows.push({ kind: landscapeCount++ % 3 === 0 ? 'full' : 'inset', images: [current] })
      i += 1
    }
    flushChapters(i)
  }
  pending.forEach((chapter) => rows.push({ kind: 'chapter', chapter }))
  return rows
}
