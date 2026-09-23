import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { buildMetadata } from '@/lib/seo'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { getTestPayload, unique } from '../helpers/payload'

let payload: Payload

beforeAll(async () => {
  payload = await getTestPayload()
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { siteName: 'RB Studio', seoDescription: 'Default description', seoTitle: 'RB Studio — Photographer' },
  })
})

describe('page metadata', () => {
  it('uses the SEO fields, canonical URL and Open Graph overrides', async () => {
    const meta = await buildMetadata({
      meta: { title: 'Wedding photographer Stockholm', description: 'Desc', ogTitle: 'Share title' },
      path: '/services/weddings',
    })
    expect(meta.title).toBe('Wedding photographer Stockholm')
    expect(meta.description).toBe('Desc')
    expect(meta.alternates?.canonical).toBe('http://localhost:3000/services/weddings')
    expect(meta.openGraph?.title).toBe('Share title')
    expect(meta.robots).toBeUndefined()
  })

  it('falls back to the page title and the default description', async () => {
    const meta = await buildMetadata({ title: 'About', path: '/about' })
    expect(meta.title).toBe('About')
    expect(meta.description).toBe('Default description')
  })

  it('respects a custom canonical URL and noindex', async () => {
    const meta = await buildMetadata({ meta: { canonical: 'https://other.se/x', noIndex: true }, path: '/x' })
    expect(meta.alternates?.canonical).toBe('https://other.se/x')
    expect(meta.robots).toEqual({ index: false, follow: true })
  })
})

describe('sitemap.xml', () => {
  it('lists published content and leaves out drafts, noindex and excluded pages', async () => {
    const visible = unique('visible')
    const draft = unique('draft')
    const noindex = unique('noindex')
    const excluded = unique('excluded')
    await payload.create({ collection: 'pages', data: { title: visible, _status: 'published' } })
    await payload.create({ collection: 'pages', data: { title: draft, _status: 'draft' }, draft: true })
    await payload.create({ collection: 'pages', data: { title: noindex, _status: 'published', meta: { noIndex: true } } })
    await payload.create({ collection: 'pages', data: { title: excluded, _status: 'published', excludeFromSitemap: true } })
    const service = await payload.create({ collection: 'services', data: { title: unique('Service') } })

    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain(`http://localhost:3000/${visible}`)
    expect(urls).toContain(`http://localhost:3000/services/${service.slug}`)
    expect(urls).not.toContain(`http://localhost:3000/${draft}`)
    expect(urls).not.toContain(`http://localhost:3000/${noindex}`)
    expect(urls).not.toContain(`http://localhost:3000/${excluded}`)
  })

  it('maps the "home" page to the site root', async () => {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } } })
    if (!existing.totalDocs) await payload.create({ collection: 'pages', data: { title: 'Home', slug: 'home', _status: 'published' } })
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain('http://localhost:3000/')
    expect(urls).not.toContain('http://localhost:3000/home')
  })
})

describe('robots.txt', () => {
  it('keeps the admin and API out of search engines and points to the sitemap', () => {
    const r = robots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/api']))
    expect(r.sitemap).toBe('http://localhost:3000/sitemap.xml')
  })
})
