import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 3600

const base = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/** sitemap.xml — generated automatically from all published content. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const published = { _status: { equals: 'published' } } as const
  const opts = { limit: 5000, depth: 0, overrideAccess: false } as const

  const [pages, projects, services, posts, categories] = await Promise.all([
    payload.find({ collection: 'pages', where: published, ...opts, select: { slug: true, updatedAt: true, excludeFromSitemap: true, meta: true } }),
    payload.find({ collection: 'projects', where: published, ...opts, select: { slug: true, updatedAt: true, meta: true } }),
    payload.find({ collection: 'services', ...opts, select: { slug: true, updatedAt: true, meta: true } }),
    payload.find({ collection: 'posts', where: published, ...opts, select: { slug: true, updatedAt: true, meta: true } }),
    payload.find({ collection: 'categories', ...opts, select: { slug: true, updatedAt: true, meta: true } }),
  ])

  const entry = (path: string, updatedAt: string, priority = 0.7) => ({
    url: `${base()}${path}`,
    lastModified: new Date(updatedAt),
    priority,
  })
  const indexable = <T extends { meta?: { noIndex?: boolean | null } | null; slug?: string | null }>(d: T) =>
    Boolean(d.slug) && !d.meta?.noIndex

  return [
    ...pages.docs
      .filter((p) => indexable(p) && !p.excludeFromSitemap)
      .map((p) => entry(p.slug === 'home' ? '/' : `/${p.slug}`, p.updatedAt, p.slug === 'home' ? 1 : 0.8)),
    ...categories.docs.filter(indexable).map((c) => entry(`/portfolio/${c.slug}`, c.updatedAt, 0.8)),
    ...services.docs.filter(indexable).map((s) => entry(`/services/${s.slug}`, s.updatedAt, 0.9)),
    ...projects.docs.filter(indexable).map((p) => entry(`/stories/${p.slug}`, p.updatedAt, 0.7)),
    ...posts.docs.filter(indexable).map((p) => entry(`/journal/${p.slug}`, p.updatedAt, 0.6)),
  ]
}
