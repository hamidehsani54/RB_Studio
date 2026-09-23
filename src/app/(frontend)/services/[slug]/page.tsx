import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Media } from '@/payload-types'
import { getPackages, getProjects, getServiceBySlug, getServices, getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { asMedia, ogImageUrl, serverUrl } from '@/lib/utils'
import { Img } from '@/components/site/Img'
import { RichText } from '@/components/site/RichText'
import { PackageCards } from '@/components/site/blocks/Business'
import { ProjectGrid, StoryFlow } from '@/components/site/blocks/Portfolio'
import { JsonLd } from '@/components/site/JsonLd'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.filter((s) => s.slug).map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  const settings = await getSettings()
  const area = service.areas?.[0]?.name || settings.city
  return buildMetadata({
    meta: service.meta,
    title: area ? `${service.title} in ${area}` : service.title,
    description: service.excerpt,
    image: service.image,
    path: `/services/${slug}`,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const categoryId = service.relatedCategory
    ? typeof service.relatedCategory === 'object'
      ? service.relatedCategory.id
      : service.relatedCategory
    : null
  const [packages, projects, settings] = await Promise.all([
    getPackages({ service: { equals: service.id } }),
    categoryId ? getProjects({ category: { equals: categoryId } }, 4) : Promise.resolve([]),
    getSettings(),
  ])
  const image = asMedia(service.image)
  const gallery = (service.gallery ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
  const ctaHref = service.ctaUrl || `/contact?service=${encodeURIComponent(service.slug || '')}#inquiry`
  const areas = (service.areas ?? []).map((a) => a.name)

  return (
    <>
      {image ? (
        <section className="page-header page-header--image" data-header-overlay="">
          <div className="page-header__bg">
            <Img media={image} priority />
          </div>
          <div className="container">
            <p className="eyebrow">Services</p>
            <h1 className="display">{service.title}</h1>
            {service.excerpt && <p className="page-header__text">{service.excerpt}</p>}
          </div>
        </section>
      ) : (
        <section className="page-header">
          <div className="container">
            <p className="eyebrow">Services</p>
            <h1 className="display">{service.title}</h1>
            {service.excerpt && <p className="page-header__text lede">{service.excerpt}</p>}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container service-detail">
          <div data-reveal>
            <RichText data={service.description} />
          </div>
          <aside className="service-detail__aside" data-reveal>
            {service.startingPrice && (
              <>
                <p className="small-caps muted">Investment</p>
                <p className="service-detail__price">{service.startingPrice}</p>
                {service.priceNote && <p className="muted" style={{ fontSize: '0.85rem' }}>{service.priceNote}</p>}
              </>
            )}
            {(service.features?.length ?? 0) > 0 && (
              <ul className="features">
                {service.features!.map((f) => (
                  <li key={f.id}>{f.text}</li>
                ))}
              </ul>
            )}
            <Link href={ctaHref} className="btn btn--solid">
              {service.ctaLabel || 'Check availability'}
            </Link>
            {areas.length > 0 && <p className="areas">Available in {areas.join(', ')} and beyond.</p>}
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <StoryFlow images={gallery} />
          </div>
        </section>
      )}

      {packages.length > 0 && (
        <section className="section tone-sand">
          <div className="container">
            <header className="section-head section-head--center">
              <p className="eyebrow">Collections</p>
              <h2 className="h2">{service.title} packages</h2>
            </header>
            <PackageCards packages={packages} />
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <header className="section-head section-head--split">
              <div>
                <p className="eyebrow">Recent work</p>
                <h2 className="h2">Stories</h2>
              </div>
            </header>
            <ProjectGrid projects={projects} />
          </div>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          serviceType: service.title,
          description: service.excerpt || undefined,
          url: `${serverUrl()}/services/${slug}`,
          image: ogImageUrl(service.image),
          provider: { '@id': `${serverUrl()}/#business` },
          areaServed: (areas.length ? areas : (settings.serviceAreas ?? []).map((a) => a.name)).map((name) => ({
            '@type': 'Place',
            name,
          })),
          offers: packages.map((p) => ({ '@type': 'Offer', name: p.name, description: p.description || undefined, price: p.price })),
        }}
      />
    </>
  )
}
