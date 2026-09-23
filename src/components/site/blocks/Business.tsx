import Link from 'next/link'
import React from 'react'
import type {
  AvailabilityBlock,
  FaqBlock,
  Package,
  PricingBlock,
  ProcessBlock,
  Service,
  ServicesBlock,
} from '@/payload-types'
import { getAvailability, getFaqs, getPackages, getProcessSteps, getServices } from '@/lib/data'
import { asDocs, asMedia, cx, pad2 } from '@/lib/utils'
import { Frame } from '../Img'
import { JsonLd } from '../JsonLd'
import { CtaLink, Section, SectionHead } from './shared'

/* ---------- Services ---------- */

export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <div className="services-grid">
      {services.map((s, i) => (
        <article key={s.id} data-reveal style={{ ['--d' as string]: i % 3 }}>
          <Link href={`/services/${s.slug}`} className="service-card">
            <Frame media={s.image} ratio="portrait" hover reveal={false} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw" />
            <span className="service-card__num">{pad2(i + 1)}</span>
            <h3 className="service-card__title">{s.title}</h3>
            {s.excerpt && <p className="service-card__text">{s.excerpt}</p>}
            <div className="service-card__foot">
              <span>{s.startingPrice || 'Discover'}</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}

export async function Services({ block }: { block: ServicesBlock }) {
  const services = block.mode === 'selected' ? asDocs<Service>(block.services) : await getServices()
  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} text={block.text} />
        <ServiceCards services={services} />
        {block.cta?.label && (
          <div className="section-foot">
            <CtaLink link={block.cta} className="btn" arrow={false} />
          </div>
        )}
      </div>
    </Section>
  )
}

/* ---------- Pricing ---------- */

export function PackageCards({ packages }: { packages: Package[] }) {
  if (packages.length === 0) return null
  return (
    <div className="pricing">
      {packages.map((p, i) => {
        const href = p.ctaUrl || `/contact?package=${encodeURIComponent(p.slug || '')}#inquiry`
        return (
          <article key={p.id} className={cx('package', p.mostPopular && 'package--popular')} data-reveal style={{ ['--d' as string]: i }}>
            {p.mostPopular && <span className="package__badge">Most popular</span>}
            {asMedia(p.image) && (
              <div className="package__image">
                <Frame media={p.image} ratio="landscape" reveal={false} sizes="(min-width: 900px) 30vw, 100vw" />
              </div>
            )}
            <h3 className="package__name">{p.name}</h3>
            {p.tagline && <p className="package__tagline">{p.tagline}</p>}
            <p className="package__price">{p.price}</p>
            {p.priceNote && <p className="package__note">{p.priceNote}</p>}
            {p.description && <p className="package__desc">{p.description}</p>}
            {(p.features?.length ?? 0) > 0 && (
              <ul className="features">
                {p.features!.map((f) => (
                  <li key={f.id}>{f.text}</li>
                ))}
              </ul>
            )}
            <Link href={href} className={cx('btn', p.mostPopular && 'btn--solid')} style={{ marginTop: 'auto' }}>
              {p.ctaLabel || 'Enquire'}
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export async function Pricing({ block }: { block: PricingBlock }) {
  const packages = block.mode === 'selected' ? asDocs<Package>(block.packages) : await getPackages()
  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} text={block.text} align="center" />
        <PackageCards packages={packages} />
        {block.footnote && <p className="pricing-foot">{block.footnote}</p>}
      </div>
    </Section>
  )
}

/* ---------- Process ---------- */

export async function Process({ block }: { block: ProcessBlock }) {
  const steps = await getProcessSteps()
  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} text={block.text} />
        {asMedia(block.image) && (
          <div className="process-image">
            <Frame media={block.image} ratio="cinema" sizes="100vw" />
          </div>
        )}
        <ol className="process">
          {steps.map((s, i) => (
            <li key={s.id} className="process__step" data-reveal style={{ ['--d' as string]: i }}>
              <span className="process__num" aria-hidden="true">
                {pad2(i + 1)}
              </span>
              <h3 className="process__title">{s.title}</h3>
              {s.text && <p className="process__text">{s.text}</p>}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

/* ---------- FAQ ---------- */

export async function Faq({ block }: { block: FaqBlock }) {
  const faqs = await getFaqs(block.topic, block.limit ?? 50)
  const groups = new Map<string, typeof faqs>()
  for (const f of faqs) {
    const key = block.groupByTopic ? f.topic || 'General' : ''
    groups.set(key, [...(groups.get(key) ?? []), f])
  }
  return (
    <Section block={block}>
      <div className="container faq">
        <div className="faq__head">
          {block.eyebrow && (
            <p className="eyebrow" data-reveal>
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="h2" data-reveal>
              {block.heading}
            </h2>
          )}
          {block.text && <p className="section-head__text">{block.text}</p>}
          <CtaLink link={block.cta} />
        </div>
        <div>
          {[...groups.entries()].map(([topic, items]) => (
            <div key={topic || 'all'}>
              {topic && <h3 className="faq__topic small-caps muted">{topic}</h3>}
              <div className="accordion">
                {items.map((f) => (
                  <details key={f.id}>
                    <summary>{f.question}</summary>
                    <div className="accordion__answer">{f.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
    </Section>
  )
}

/* ---------- Availability ---------- */

const statusText = { booked: 'Booked', tentative: 'On hold', available: 'Available' } as const

export async function Availability({ block }: { block: AvailabilityBlock }) {
  const all = await getAvailability(block.monthsAhead ?? 18)
  const dates = all.filter((d) => block.showTentative || d.status !== 'tentative')

  // Group: year → month → dates
  const years = new Map<number, Map<number, typeof dates>>()
  for (const d of dates) {
    const date = new Date(d.date)
    const y = date.getUTCFullYear()
    const m = date.getUTCMonth()
    if (!years.has(y)) years.set(y, new Map())
    const months = years.get(y)!
    months.set(m, [...(months.get(m) ?? []), d])
  }

  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} text={block.text} />
        {years.size === 0 ? (
          <p className="availability__empty">Every date is currently open — get in touch to reserve yours.</p>
        ) : (
          [...years.entries()].map(([year, months]) => (
            <div key={year} className="availability__year" data-reveal>
              <h3 className="availability__year-label">{year}</h3>
              <div className="availability__months">
                {[...months.entries()].map(([month, items]) => (
                  <div key={month} className="availability__month">
                    <h4 style={{ fontSize: '1.5rem', marginBottom: '0.9rem' }}>
                      {new Date(Date.UTC(year, month, 1)).toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' })}
                    </h4>
                    <ul>
                      {items.map((d) => (
                        <li key={d.id}>
                          <span className={cx('status-dot', `status-dot--${d.status}`)} aria-hidden="true" />
                          <span>
                            {pad2(new Date(d.date).getUTCDate())} — {statusText[d.status]}
                            {d.label ? <span className="muted"> · {d.label}</span> : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <div className="availability__legend">
          <span>
            <span className="status-dot" aria-hidden="true" /> Booked
          </span>
          {block.showTentative && (
            <span>
              <span className="status-dot status-dot--tentative" aria-hidden="true" /> On hold — may open up
            </span>
          )}
          <span>Dates not listed are available.</span>
        </div>
        {block.cta?.label && (
          <div className="section-foot" style={{ justifyContent: 'flex-start' }}>
            <CtaLink link={block.cta} className="btn" arrow={false} />
          </div>
        )}
      </div>
    </Section>
  )
}
