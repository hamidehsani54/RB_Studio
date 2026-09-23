import type { Media } from '@/payload-types'

export const serverUrl = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Relationship fields may be an ID or a populated document. */
export const asDoc = <T extends { id: number | string }>(value: unknown): T | null =>
  value && typeof value === 'object' && 'id' in (value as object) ? (value as T) : null

export const asDocs = <T extends { id: number | string }>(values: unknown): T[] =>
  Array.isArray(values) ? values.map((v) => asDoc<T>(v)).filter((v): v is T => Boolean(v)) : []

/** Media URLs pointing at this site are made relative so next/image optimises them locally. */
export const localPath = (url?: string | null) => {
  if (!url) return url
  const base = serverUrl()
  return url.startsWith(base) ? url.slice(base.length) || '/' : url
}

export const asMedia = (value: unknown): Media | null => {
  const m = asDoc<Media>(value)
  return m?.url ? { ...m, url: localPath(m.url) } : null
}

export const absoluteUrl = (path?: string | null) => {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${serverUrl()}${path.startsWith('/') ? '' : '/'}${path}`
}

export const ogImageUrl = (media: unknown) => {
  const m = asMedia(media)
  if (!m) return undefined
  return absoluteUrl(m.sizes?.og?.url || m.sizes?.large?.url || m.url)
}

export const formatDate = (value?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  value ? new Date(value).toLocaleDateString('en-GB', { timeZone: 'Europe/Stockholm', ...opts }) : ''

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const isExternal = (url?: string | null) => Boolean(url && /^(https?:)?\/\//.test(url))

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

/** YouTube / Vimeo link → privacy-friendly embed URL (null for anything else). */
export const embedUrl = (url: string) => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`
  return null
}
