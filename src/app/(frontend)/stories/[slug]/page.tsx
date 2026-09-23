import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Category, Media } from '@/payload-types'
import { getClient, getProjectBySlug, getProjects, getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl, asDoc, asMedia, formatDate, serverUrl } from '@/lib/utils'
import { Frame, Img } from '@/components/site/Img'
import { StoryFlow } from '@/components/site/blocks/Portfolio'
import { JsonLd } from '@/components/site/JsonLd'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
  })
  return res.docs.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return buildMetadata({
    meta: project.meta,
    title: [project.title, project.location].filter(Boolean).join(' — '),
    description: project.excerpt,
    image: project.cover,
    path: `/stories/${slug}`,
    type: 'article',
  })
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const [all, settings] = await Promise.all([getProjects(undefined, 500), getSettings()])
  const index = all.findIndex((p) => p.id === project.id)
  const next = all.length > 1 ? all[(index + 1) % all.length] : null
  const category = asDoc<Category>(project.category)
  const images = (project.gallery ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
  const cover = asMedia(project.cover)

  return (
    <article>
      <section className="hero" data-header-overlay="">
        <div className="hero__slides">
          <div className="hero__slide is-active">{cover && <Img media={cover} priority />}</div>
        </div>
        <div className="hero__shade" />
        <div className="container hero__content">
          {category && (
            <p className="eyebrow hero__eyebrow">
              <Link href={`/portfolio/${category.slug}`}>{category.title}</Link>
            </p>
          )}
          <h1 className="display hero__title">{project.title}</h1>
          <p className="story-hero__meta">
            {project.location && <span>{project.location}</span>}
            {project.date && <span>{formatDate(project.date, { month: 'long', year: 'numeric' })}</span>}
          </p>
        </div>
      </section>

      {project.excerpt && (
        <section className="section">
          <div className="container story-intro">
            <p className="lede" data-reveal>
              {project.excerpt}
            </p>
            <dl className="facts" data-reveal>
              {category && (
                <div>
                  <dt>Story</dt>
                  <dd>{category.title}</dd>
                </div>
              )}
              {project.location && (
                <div>
                  <dt>Location</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
              {project.date && (
                <div>
                  <dt>Date</dt>
                  <dd>{formatDate(project.date, { month: 'long', year: 'numeric' })}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: project.excerpt ? 0 : undefined }}>
        <div className="container">
          <StoryFlow images={images} chapters={project.chapters ?? []} />

          {(project.credits?.length ?? 0) > 0 && (
            <div className="credits" data-reveal>
              <h2 className="small-caps muted" style={{ fontFamily: 'var(--sans)' }}>
                Credits
              </h2>
              <ul className="list-lined">
                {project.credits!.map((c) => (
                  <li key={c.id}>
                    <span>{c.role}</span>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section tone-sand cta">
        <div className="container">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            Your story next
          </p>
          <h2 className="h2">Planning something beautiful?</h2>
          <p className="cta__text">Tell me about your day — I’d love to hear what you’re dreaming of.</p>
          <Link href={settings.headerCtaUrl || '/contact'} className="btn">
            {settings.headerCtaLabel || 'Check availability'}
          </Link>
        </div>
      </section>

      {next && next.id !== project.id && (
        <section className="section tone-dark">
          <div className="container">
            <Link href={`/stories/${next.slug}`} className="next-project next-project__link">
              <div>
                <p className="eyebrow">Next story</p>
                <h2 className="h2">{next.title}</h2>
                <p className="small-caps muted" style={{ marginTop: '1.4rem' }}>
                  {next.location}
                </p>
              </div>
              <Frame media={next.cover} ratio="landscape" hover sizes="(min-width: 900px) 50vw, 100vw" />
            </Link>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: project.title,
            description: project.excerpt || undefined,
            url: `${serverUrl()}/stories/${slug}`,
            dateCreated: project.date || undefined,
            contentLocation: project.location ? { '@type': 'Place', name: project.location } : undefined,
            author: { '@id': `${serverUrl()}/#business` },
            image: [cover, ...images].filter(Boolean).slice(0, 20).map((m) => ({
              '@type': 'ImageObject',
              contentUrl: absoluteUrl(m!.url),
              caption: m!.caption || m!.alt,
              width: m!.width,
              height: m!.height,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Portfolio', item: `${serverUrl()}/portfolio` },
              ...(category
                ? [{ '@type': 'ListItem', position: 2, name: category.title, item: `${serverUrl()}/portfolio/${category.slug}` }]
                : []),
              { '@type': 'ListItem', position: category ? 3 : 2, name: project.title, item: `${serverUrl()}/stories/${slug}` },
            ],
          },
        ]}
      />
    </article>
  )
}
