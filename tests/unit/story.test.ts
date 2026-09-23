import { describe, expect, it } from 'vitest'
import type { Media } from '@/payload-types'
import { composeStory, isPortrait } from '@/lib/story'

let id = 0
const img = (w: number, h: number) => ({ id: ++id, alt: 'x', url: `/x${id}.webp`, width: w, height: h }) as Media
const P = () => img(800, 1200) // portrait
const L = () => img(1500, 1000) // landscape

const kinds = (rows: ReturnType<typeof composeStory>) => rows.map((r) => r.kind)

describe('isPortrait', () => {
  it('detects portrait, landscape and square images', () => {
    expect(isPortrait(P())).toBe(true)
    expect(isPortrait(L())).toBe(false)
    expect(isPortrait(img(1000, 1000))).toBe(false)
    expect(isPortrait(null)).toBe(false)
  })
})

describe('composeStory (automatic editorial layout)', () => {
  it('returns nothing for an empty gallery', () => {
    expect(composeStory([])).toEqual([])
  })

  it('places two consecutive portraits side by side', () => {
    const rows = composeStory([P(), P()])
    expect(kinds(rows)).toEqual(['pair'])
  })

  it('alternates single portraits left and right', () => {
    expect(kinds(composeStory([P(), L(), P()]))).toEqual(['portrait-left', 'full', 'portrait-right'])
  })

  it('rotates landscapes between full-bleed and inset', () => {
    expect(kinds(composeStory([L(), L(), L(), L()]))).toEqual(['full', 'inset', 'inset', 'full'])
  })

  it('keeps every image exactly once and in order', () => {
    const images = [L(), P(), P(), L(), P(), L(), P(), P()]
    const out = composeStory(images).flatMap((r) => ('images' in r ? r.images : []))
    expect(out.map((m) => m.id)).toEqual(images.map((m) => m.id))
  })

  it('weaves text passages in after the chosen photograph', () => {
    const rows = composeStory([L(), L(), L()], [
      { text: 'Intro', afterImage: 0 },
      { text: 'After two', afterImage: 2 },
    ])
    expect(kinds(rows)).toEqual(['chapter', 'full', 'inset', 'chapter', 'inset'])
  })

  it('does not split a text passage by pairing across it', () => {
    const rows = composeStory([P(), P()], [{ text: 'Between', afterImage: 1 }])
    expect(kinds(rows)).toEqual(['portrait-left', 'chapter', 'portrait-right'])
  })

  it('appends passages placed beyond the last photo at the end', () => {
    const rows = composeStory([L()], [{ text: 'Late', afterImage: 99 }])
    expect(kinds(rows)).toEqual(['full', 'chapter'])
  })
})
