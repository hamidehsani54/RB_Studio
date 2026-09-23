/**
 * End-to-end smoke tests against a running site.
 *   npm run dev   (or npm start)   then   npm run test:smoke
 * Target another address with SITE_URL=https://rbstudio.se npm run test:smoke
 */
import { beforeAll, describe, expect, it } from 'vitest'

const BASE = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const get = (path: string, init?: RequestInit) => fetch(`${BASE}${path}`, { redirect: 'manual', ...init })

let sitemapPaths: string[] = []
const pages = new Map<string, string>()

beforeAll(async () => {
  const res = await get('/sitemap.xml')
  expect(res.status, 'Is the site running? Start it with `npm run dev`.').toBe(200)
  const xml = await res.text()
  sitemapPaths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  // Fetch every page once (sequentially — the dev server compiles on first request).
  for (const p of sitemapPaths) pages.set(p, await (await get(p)).text())
}, 600_000)

describe('every page in the sitemap', () => {
  it('the sitemap lists the key pages', () => {
    for (const p of ['/', '/about', '/portfolio', '/services', '/pricing', '/faq', '/availability', '/contact', '/journal']) {
      expect(sitemapPaths).toContain(p)
    }
    expect(sitemapPaths.some((p) => p.startsWith('/stories/'))).toBe(true)
    expect(sitemapPaths.some((p) => p.startsWith('/services/'))).toBe(true)
    expect(sitemapPaths.some((p) => p.startsWith('/portfolio/'))).toBe(true)
  })

  it('loads without errors', async () => {
    for (const p of sitemapPaths) {
      const html = pages.get(p)!
      expect(html, p).toContain('</html>')
      expect(html, `${p} rendered an error`).not.toContain('data-next-error-message')
    }
  })

  it('has exactly one <h1>, a language, a title and a meta description', () => {
    for (const [p, html] of pages) {
      expect((html.match(/<h1[\s>]/g) ?? []).length, `${p} <h1> count`).toBe(1)
      expect(html, p).toMatch(/<html lang="en"/)
      expect(html, p).toMatch(/<title>[^<]{5,}<\/title>/)
      expect(html, p).toMatch(/<meta name="description" content="[^"]{20,}"/)
    }
  })

  it('has a canonical URL and Open Graph tags', () => {
    for (const [p, html] of pages) {
      expect(html, p).toMatch(/<link rel="canonical" href="[^"]+"/)
      expect(html, p).toMatch(/<meta property="og:title"/)
      expect(html, p).toMatch(/<meta property="og:image"/)
    }
  })

  it('gives every image alt text', () => {
    for (const [p, html] of pages) {
      const imgs = html.match(/<img\b[^>]*>/g) ?? []
      imgs.forEach((tag) => expect(tag, `${p}: ${tag.slice(0, 120)}`).toMatch(/\salt="/))
    }
  })

  it('includes valid structured data (JSON-LD)', () => {
    for (const [p, html] of pages) {
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      expect(blocks.length, p).toBeGreaterThan(0)
      blocks.forEach((b) => expect(() => JSON.parse(b[1]), p).not.toThrow())
    }
    const home = pages.get('/')!
    expect(home).toContain('"LocalBusiness"')
  })

  it('shows the website credit in the footer', () => {
    for (const [p, html] of pages) expect(html, p).toMatch(/Website by(\s|<!-- -->)*(<a[^>]*>)?Hamid Ehsani/)
  })

  it('offers a skip-to-content link for keyboard users', () => {
    for (const [p, html] of pages) expect(html, p).toContain('href="#main"')
  })
})

describe('specific features', () => {
  it('unknown pages return 404', async () => {
    expect((await get('/this-page-does-not-exist')).status).toBe(404)
    expect((await get('/stories/does-not-exist')).status).toBe(404)
  })

  it('robots.txt blocks the admin and links the sitemap', async () => {
    const txt = await (await get('/robots.txt')).text()
    expect(txt).toMatch(/Disallow: \/admin/)
    expect(txt).toMatch(/Sitemap: .*\/sitemap\.xml/)
  })

  it('the homepage shows availability, pricing and the inquiry form', () => {
    const home = pages.get('/')!
    expect(home).toContain('Booked')
    expect(home).toContain('class="pricing"')
    expect(home).toContain('name="consent"')
  })

  it('the FAQ page includes FAQ structured data and accordions', () => {
    const faq = pages.get('/faq')!
    expect(faq).toContain('"FAQPage"')
    expect(faq).toContain('<details')
  })

  it('photographs are served as AVIF/WebP in responsive sizes', async () => {
    const home = pages.get('/')!
    const src = home.match(/srcSet="([^"]+)"/)?.[1] ?? home.match(/srcset="([^"]+)"/)?.[1]
    expect(src, 'responsive srcset').toBeTruthy()
    const firstUrl = src!.split(',')[0].trim().split(' ')[0].replace(/&amp;/g, '&')
    const res = await get(firstUrl, { headers: { Accept: 'image/avif,image/webp,*/*' } })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/image\/(avif|webp)/)
  }, 120_000)
})

describe('security', () => {
  it('sends security headers', async () => {
    const res = await get('/')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(res.headers.get('x-frame-options')).toBe('SAMEORIGIN')
    expect(res.headers.get('referrer-policy')).toBeTruthy()
  })

  it('inquiries and users are not readable without logging in', async () => {
    expect((await get('/api/inquiries')).status).toBe(403)
    expect((await get('/api/inquiries/export')).status).toBe(401)
    expect((await get('/api/users')).status).toBe(403)
  })

  it('the public availability API never includes private notes', async () => {
    const json = await (await get('/api/availability?limit=100')).json()
    expect(json.docs.length).toBeGreaterThan(0)
    json.docs.forEach((d: Record<string, unknown>) => expect(d).not.toHaveProperty('note'))
  })

  it('the Instagram token is not exposed', async () => {
    const json = await (await get('/api/globals/site-settings')).json()
    expect(json).not.toHaveProperty('instagramToken')
  })

  it('anonymous visitors cannot create content through the API', async () => {
    const res = await get('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'hack', answer: 'hack' }),
    })
    expect(res.status).toBe(403)
  })

  it('preview mode refuses invalid links', async () => {
    expect((await get('/next/preview?path=/&secret=wrong')).status).toBe(403)
  })

  it('the admin requires a login', async () => {
    const me = await (await get('/api/users/me')).json()
    expect(me.user).toBeNull()
    const admin = await get('/admin')
    expect([200, 302, 307]).toContain(admin.status)
    if (admin.status === 200) expect(await admin.text()).toMatch(/login/i)
  })
})
