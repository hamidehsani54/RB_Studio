import 'server-only'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'

export const getClient = cache(async () => getPayload({ config }))

/** Draft mode is switched on through the admin "Preview" button. */
export const isDraft = cache(async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
})

/**
 * Public queries run with access control ON (overrideAccess: false) as an anonymous visitor,
 * so unpublished drafts and private fields (e.g. availability notes) never leak.
 * In preview mode drafts are included.
 */
const publicOpts = async () => {
  const draft = await isDraft()
  return draft ? { draft: true, overrideAccess: true } : { draft: false, overrideAccess: false }
}

export const getSettings = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })
})

export const getAbout = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'about', depth: 1, overrideAccess: false })
})

export const getPageBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    ...(await publicOpts()),
  })
  return res.docs[0] ?? null
})

export const getProjectBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    ...(await publicOpts()),
  })
  return res.docs[0] ?? null
})

export const getProjects = cache(async (where?: Where, limit = 100) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'projects',
    where,
    depth: 1,
    limit,
    sort: '_order',
    ...(await publicOpts()),
  })
  return res.docs
})

export const getCategories = cache(async () => {
  const payload = await getClient()
  const res = await payload.find({ collection: 'categories', depth: 1, limit: 100, sort: '_order', overrideAccess: false })
  return res.docs
})

export const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return res.docs[0] ?? null
})

export const getServices = cache(async () => {
  const payload = await getClient()
  const res = await payload.find({ collection: 'services', depth: 1, limit: 100, sort: '_order', overrideAccess: false })
  return res.docs
})

export const getServiceBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return res.docs[0] ?? null
})

export const getPackages = cache(async (where?: Where) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'packages',
    where,
    depth: 1,
    limit: 50,
    sort: '_order',
    overrideAccess: false,
  })
  return res.docs
})

export const getTestimonials = cache(async (where?: Where, limit = 20) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'testimonials',
    where,
    depth: 1,
    limit,
    sort: '_order',
    overrideAccess: false,
  })
  return res.docs
})

export const getFaqs = cache(async (topic?: string | null, limit = 100) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'faqs',
    where: topic ? { topic: { equals: topic } } : undefined,
    limit,
    sort: '_order',
    overrideAccess: false,
  })
  return res.docs
})

export const getProcessSteps = cache(async () => {
  const payload = await getClient()
  const res = await payload.find({ collection: 'process-steps', limit: 20, sort: '_order', overrideAccess: false })
  return res.docs
})

export const getAvailability = cache(async (monthsAhead = 18) => {
  const payload = await getClient()
  const from = new Date()
  from.setUTCHours(0, 0, 0, 0)
  const to = new Date(from)
  to.setUTCMonth(to.getUTCMonth() + monthsAhead)
  const res = await payload.find({
    collection: 'availability',
    where: {
      and: [{ date: { greater_than_equal: from.toISOString() } }, { date: { less_than: to.toISOString() } }],
    },
    sort: 'date',
    limit: 1000,
    depth: 0,
    overrideAccess: false, // private notes are stripped by field-level access
    select: { date: true, status: true, label: true },
  })
  return res.docs
})

export const getPosts = cache(async (limit = 12, where?: Where) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'posts',
    where,
    depth: 1,
    limit,
    sort: '-publishedAt',
    ...(await publicOpts()),
  })
  return res.docs
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    ...(await publicOpts()),
  })
  return res.docs[0] ?? null
})
