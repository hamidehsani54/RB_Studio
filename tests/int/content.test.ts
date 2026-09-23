import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import type { Media } from '@/payload-types'
import { getAvailability } from '@/lib/data'
import { createImage, getTestPayload, unique } from '../helpers/payload'

let payload: Payload
let image: Media

beforeAll(async () => {
  payload = await getTestPayload()
  image = await createImage(payload, 1200, 800, 'content')
})

afterAll(async () => {
  await payload.delete({ collection: 'media', id: image.id })
})

describe('URL slugs', () => {
  it('are generated from the title, including Swedish characters', async () => {
    const c = await payload.create({ collection: 'categories', data: { title: 'Åsa & Örjan Bröllop' } })
    expect(c.slug).toBe('asa-orjan-brollop')
  })

  it('keep a manually typed slug (cleaned up)', async () => {
    const c = await payload.create({ collection: 'categories', data: { title: 'Anything', slug: 'My Custom Slug' } })
    expect(c.slug).toBe('my-custom-slug')
  })

  it('must be unique', async () => {
    const title = unique('Duplicate')
    await payload.create({ collection: 'categories', data: { title } })
    await expect(payload.create({ collection: 'categories', data: { title } })).rejects.toThrow()
  })
})

describe('availability calendar', () => {
  it('stores dates at midday UTC so a Stockholm date never shifts a day', async () => {
    // Midnight 12 June in Stockholm = 22:00 UTC on 11 June.
    const d = await payload.create({ collection: 'availability', data: { date: '2032-06-11T22:00:00.000Z', status: 'booked' } })
    expect(d.date).toBe('2032-06-12T12:00:00.000Z')
    expect(d.title).toBe('12 Jun 2032 — Booked')
  })

  it('updates the label when only the status changes', async () => {
    const d = await payload.create({ collection: 'availability', data: { date: '2032-07-03T12:00:00.000Z', status: 'booked' } })
    const updated = await payload.update({ collection: 'availability', id: d.id, data: { status: 'tentative' } })
    expect(updated.title).toBe('3 Jul 2032 — Tentative')
  })

  it('does not allow the same day twice', async () => {
    await payload.create({ collection: 'availability', data: { date: '2032-08-14T12:00:00.000Z', status: 'booked' } })
    await expect(
      payload.create({ collection: 'availability', data: { date: '2032-08-14T09:00:00.000Z', status: 'tentative' } }),
    ).rejects.toThrow()
  })

  it('public list shows only upcoming dates and never includes notes', async () => {
    const past = new Date(Date.now() - 30 * 864e5).toISOString()
    const soon = new Date(Date.now() + 20 * 864e5).toISOString()
    await payload.create({ collection: 'availability', data: { date: past, status: 'booked', note: 'old' } })
    await payload.create({ collection: 'availability', data: { date: soon, status: 'booked', note: 'private' } })
    const list = await getAvailability(3)
    expect(list.length).toBeGreaterThan(0)
    list.forEach((d) => {
      expect(new Date(d.date).getTime()).toBeGreaterThan(Date.now() - 864e5)
      expect(d).not.toHaveProperty('note')
    })
  })
})

describe('ordering (drag & drop in the admin)', () => {
  it('returns packages in the order they were arranged', async () => {
    const names = [unique('Essential'), unique('Signature'), unique('Full')]
    for (const name of names) await payload.create({ collection: 'packages', data: { name, price: '1 SEK' } })
    const res = await payload.find({ collection: 'packages', sort: '_order', limit: 100 })
    const order = res.docs.map((d) => d.name).filter((n) => names.includes(n))
    expect(order).toEqual(names)
  })
})

describe('pricing packages', () => {
  it('support features, a "Most popular" flag and a link to a service', async () => {
    const service = await payload.create({ collection: 'services', data: { title: unique('Weddings') } })
    const pkg = await payload.create({
      collection: 'packages',
      data: {
        name: 'Signature',
        price: '29 500 SEK',
        mostPopular: true,
        service: service.id,
        features: [{ text: '8 hours' }, { text: 'Online gallery' }],
      },
    })
    expect(pkg.mostPopular).toBe(true)
    expect(pkg.features?.map((f) => f.text)).toEqual(['8 hours', 'Online gallery'])
    expect(typeof pkg.service === 'object' ? pkg.service?.id : pkg.service).toBe(service.id)
  })
})

describe('journal', () => {
  it('sets the publish date automatically when an article is published', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: { title: unique('Post'), _status: 'published' },
    })
    expect(post.publishedAt).toBeTruthy()
  })

  it('keeps an explicitly chosen publish date', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: { title: unique('Post'), _status: 'published', publishedAt: '2025-01-15T09:00:00.000Z' },
    })
    expect(post.publishedAt).toBe('2025-01-15T09:00:00.000Z')
  })
})

describe('pages built from sections', () => {
  it('store sections in order with their on/off switch', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: {
        title: unique('Landing'),
        _status: 'published',
        layout: [
          { blockType: 'hero', slides: [image.id], heading: 'Hello', enabled: true },
          { blockType: 'faq', heading: 'Hidden FAQ', enabled: false },
          { blockType: 'cta', heading: 'Book now', button: { label: 'Go', url: '/contact' } },
        ],
      },
    })
    expect(page.layout?.map((b) => b.blockType)).toEqual(['hero', 'faq', 'cta'])
    expect(page.layout?.[1].enabled).toBe(false)
    expect(page.layout?.[2].enabled).toBe(true) // default on
  })
})

describe('site settings & about', () => {
  it('saves editable global content', async () => {
    const s = await payload.updateGlobal({
      slug: 'site-settings',
      data: { siteName: 'RB Studio', headerLinks: [{ label: 'Portfolio', url: '/portfolio' }], ga4Id: 'G-TEST' },
    })
    expect(s.headerLinks?.[0].label).toBe('Portfolio')
    const a = await payload.updateGlobal({ slug: 'about', data: { name: 'RB', awards: [{ name: 'Best', year: '2026' }] } })
    expect(a.awards?.[0].name).toBe('Best')
  })

  it('hides the Instagram access token from the public', async () => {
    await payload.updateGlobal({ slug: 'site-settings', data: { instagramToken: 'SECRET-TOKEN' } })
    const pub = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
    expect(pub.instagramToken).toBeUndefined()
  })
})
