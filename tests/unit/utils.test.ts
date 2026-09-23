import { describe, expect, it } from 'vitest'
import { slugify } from '@/fields'
import { csvCell } from '@/collections/Inquiries'
import { absoluteUrl, asDoc, asDocs, asMedia, cx, embedUrl, formatDate, isExternal, localPath, pad2 } from '@/lib/utils'

describe('slugify', () => {
  it('handles Swedish characters and punctuation', () => {
    expect(slugify('Åsa & Örjan — Bröllop i Stockholm!')).toBe('asa-orjan-brollop-i-stockholm')
  })
  it('collapses whitespace, underscores and dashes', () => {
    expect(slugify('  Full   Day__Package -- 2027 ')).toBe('full-day-package-2027')
  })
  it('returns an empty string for symbols only', () => {
    expect(slugify('***')).toBe('')
  })
})

describe('media URLs', () => {
  it('makes URLs on this site relative so next/image optimises them locally', () => {
    expect(localPath('http://localhost:3000/api/media/file/a.webp')).toBe('/api/media/file/a.webp')
    expect(localPath('https://cdn.example.com/a.webp')).toBe('https://cdn.example.com/a.webp')
    expect(localPath(null)).toBeNull()
  })
  it('asMedia only accepts populated documents with a URL', () => {
    expect(asMedia(12)).toBeNull()
    expect(asMedia({ id: 1, alt: 'x' })).toBeNull()
    expect(asMedia({ id: 1, alt: 'x', url: 'http://localhost:3000/api/media/file/x.webp' })?.url).toBe('/api/media/file/x.webp')
  })
  it('absoluteUrl builds full URLs for Open Graph and structured data', () => {
    expect(absoluteUrl('/stories/a')).toBe('http://localhost:3000/stories/a')
    expect(absoluteUrl('https://x.se/a')).toBe('https://x.se/a')
    expect(absoluteUrl(undefined)).toBeUndefined()
  })
})

describe('relationship helpers', () => {
  it('asDoc / asDocs skip unpopulated IDs', () => {
    expect(asDoc(5)).toBeNull()
    expect(asDocs([1, { id: 2 }, null, { id: 3 }]).map((d) => d.id)).toEqual([2, 3])
    expect(asDocs(undefined)).toEqual([])
  })
})

describe('formatting', () => {
  it('formats dates in Stockholm time (no day shift at midnight UTC)', () => {
    expect(formatDate('2027-06-11T22:30:00.000Z')).toBe('12 June 2027')
    expect(formatDate(null)).toBe('')
  })
  it('pads numbers and joins classes', () => {
    expect(pad2(3)).toBe('03')
    expect(pad2(12)).toBe('12')
    expect(cx('a', false, null, 'b', undefined)).toBe('a b')
  })
  it('detects external links', () => {
    expect(isExternal('https://instagram.com/x')).toBe(true)
    expect(isExternal('//cdn.x')).toBe(true)
    expect(isExternal('/contact')).toBe(false)
  })
})

describe('video embeds', () => {
  it('converts YouTube links to privacy-friendly embeds', () => {
    expect(embedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(embedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(embedUrl('https://youtube.com/shorts/abcdef123')).toBe('https://www.youtube-nocookie.com/embed/abcdef123')
  })
  it('converts Vimeo links and rejects anything else', () => {
    expect(embedUrl('https://vimeo.com/76979871')).toBe('https://player.vimeo.com/video/76979871?dnt=1')
    expect(embedUrl('https://evil.example.com/video')).toBeNull()
  })
})

describe('CSV export cells', () => {
  it('quotes values containing commas, quotes, semicolons or newlines', () => {
    expect(csvCell('plain')).toBe('plain')
    expect(csvCell('a, b')).toBe('"a, b"')
    expect(csvCell('say "hi"')).toBe('"say ""hi"""')
    expect(csvCell('line1\nline2')).toBe('"line1\nline2"')
    expect(csvCell('a;b')).toBe('"a;b"')
  })
  it('renders empty values as empty cells', () => {
    expect(csvCell(null)).toBe('')
    expect(csvCell(undefined)).toBe('')
    expect(csvCell(0)).toBe('0')
  })
})
