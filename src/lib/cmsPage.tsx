import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlockRenderer } from '@/components/site/BlockRenderer'
import { getPageBySlug } from './data'
import { buildMetadata } from './seo'

/** Renders a page built in the admin panel (Pages collection) by its slug. */
export async function CmsPage({ slug }: { slug: string }) {
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return <BlockRenderer blocks={page.layout} />
}

export async function cmsPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPageBySlug(slug)
  if (!page) return {}
  const firstImage = page.layout?.find((b) => b.blockType === 'hero' || b.blockType === 'pageHeader')
  const image =
    firstImage?.blockType === 'hero' ? firstImage.slides?.[0] : firstImage?.blockType === 'pageHeader' ? firstImage.image : undefined
  return buildMetadata({
    meta: page.meta,
    title: slug === 'home' ? undefined : page.title,
    image,
    path: slug === 'home' ? '/' : `/${slug}`,
  })
}
