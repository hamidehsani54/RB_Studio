import React from 'react'
import type { AboutBlock, InstagramBlock, Testimonial, TestimonialsBlock } from '@/payload-types'
import { getAbout, getClient, getSettings, getTestimonials } from '@/lib/data'
import { asDocs, asMedia, cx, formatDate } from '@/lib/utils'
import { Frame, Img } from '../Img'
import { RichText } from '../RichText'
import { QuoteSlider } from './QuoteSlider'
import { Section, SectionHead } from './shared'

/* ---------- Testimonials ---------- */

export async function Testimonials({ block }: { block: TestimonialsBlock }) {
  const limit = block.limit ?? 8
  let items: Testimonial[]
  if (block.mode === 'selected') items = asDocs<Testimonial>(block.testimonials)
  else if (block.mode === 'all') items = await getTestimonials(undefined, limit)
  else items = await getTestimonials({ featured: { equals: true } }, limit)
  if (items.length === 0) return null
  const bg = asMedia(block.backgroundImage)

  return (
    <Section block={block} className={cx('testimonials', bg && 'testimonials--image')}>
      {bg && (
        <div className="testimonials__bg">
          <Img media={bg} alt="" />
        </div>
      )}
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} align="center" />
        <QuoteSlider
          items={items.map((t) => ({
            id: t.id,
            quote: t.quote,
            name: t.clientName,
            meta: [t.location, formatDate(t.date, { month: 'long', year: 'numeric' })].filter(Boolean).join(' · '),
            image: asMedia(t.clientImage),
          }))}
        />
      </div>
    </Section>
  )
}

/* ---------- Instagram ---------- */

type IgPost = { id: string; media_url?: string; thumbnail_url?: string; permalink: string; caption?: string; media_type: string }

async function fetchInstagram(token: string, limit: number): Promise<IgPost[]> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption&limit=${limit}&access_token=${encodeURIComponent(token)}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const json = await res.json()
    return (json.data ?? []) as IgPost[]
  } catch {
    return []
  }
}

export async function Instagram({ block }: { block: InstagramBlock }) {
  const settings = await getSettings()
  const limit = block.limit ?? 6
  const profile = settings.social?.find((s) => s.platform === 'instagram')?.url
  const handle = settings.instagramHandle

  // The token is admin-only, so read it with elevated access on the server — it is never sent to the browser.
  let live: IgPost[] = []
  if (block.source === 'live') {
    const client = await getClient()
    const full = await client.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
    if (full.instagramToken) live = await fetchInstagram(full.instagramToken, limit)
  }
  const manual = (block.images ?? []).map(asMedia).filter(Boolean).slice(0, limit)

  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading}>
          {profile && (
            <a href={profile} className="link" target="_blank" rel="noopener noreferrer">
              {handle || 'Instagram'} <span className="arrow">↗</span>
            </a>
          )}
        </SectionHead>
        <div className="insta-grid">
          {live.length > 0
            ? live.map((p) => (
                <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer">
                  <div className="frame ratio-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url}
                      alt={p.caption?.slice(0, 120) || 'Instagram post'}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </a>
              ))
            : manual.map((m) => (
                <a key={m!.id} href={profile || '#'} target={profile ? '_blank' : undefined} rel="noopener noreferrer">
                  <Frame media={m} ratio="square" sizes="(min-width: 900px) 16vw, 33vw" />
                </a>
              ))}
        </div>
      </div>
    </Section>
  )
}

/* ---------- About the photographer ---------- */

export async function About({ block, isFirst }: { block: AboutBlock; isFirst: boolean }) {
  const [about, settings] = await Promise.all([getAbout(), getSettings()])
  const H = isFirst ? 'h1' : 'h2'
  return (
    <Section block={block} style={isFirst ? { paddingTop: 'calc(var(--header-h) + 4rem)' } : undefined}>
      <div className="container about">
        <div className="about__media">
          <Frame media={about.portrait} ratio="tall" priority={isFirst} sizes="(min-width: 960px) 42vw, 100vw" />
        </div>
        <div>
          <p className="eyebrow" data-reveal>
            {about.role || 'About'}
          </p>
          <H className="h2" data-reveal>
            {about.headline || about.name}
          </H>
          {about.location && (
            <p className="about__location small-caps" data-reveal>
              {about.location}
            </p>
          )}
          <div className="about__bio" data-reveal>
            <RichText data={about.bio} />
          </div>

          {block.showExperience && (about.experience?.length ?? 0) > 0 && (
            <div className="stats" data-reveal>
              {about.experience!.map((e) => (
                <div key={e.id}>
                  <div className="stat__value">{e.value}</div>
                  <div className="stat__label">{e.label}</div>
                </div>
              ))}
            </div>
          )}

          {block.showPhilosophy && (about.philosophy || about.style) && (
            <div data-reveal>
              {about.philosophy && <p className="pull">{about.philosophy}</p>}
              {about.style && <p className="muted">{about.style}</p>}
            </div>
          )}

          {asMedia(about.secondaryImage) && (
            <div style={{ margin: '3.5rem 0' }}>
              <Frame media={about.secondaryImage} ratio="landscape" sizes="(min-width: 960px) 45vw, 100vw" />
            </div>
          )}

          <div className="about__cols">
            {block.showPublications && (about.publications?.length ?? 0) > 0 && (
              <div data-reveal>
                <h3 className="small-caps muted" style={{ fontFamily: 'var(--sans)' }}>
                  Published in
                </h3>
                <ul className="list-lined">
                  {about.publications!.map((p) => (
                    <li key={p.id}>
                      <span>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a> : p.name}</span>
                      <span>{p.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {block.showAwards && (about.awards?.length ?? 0) > 0 && (
              <div data-reveal>
                <h3 className="small-caps muted" style={{ fontFamily: 'var(--sans)' }}>
                  Awards
                </h3>
                <ul className="list-lined">
                  {about.awards!.map((a) => (
                    <li key={a.id}>
                      <span>
                        {a.name}
                        {a.issuer && <span className="muted"> — {a.issuer}</span>}
                      </span>
                      <span>{a.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {(about.facts?.length ?? 0) > 0 && (
            <div style={{ marginTop: '3rem' }} data-reveal>
              <h3 className="small-caps muted" style={{ fontFamily: 'var(--sans)' }}>
                A few things about me
              </h3>
              <ul className="list-lined">
                {about.facts!.map((f) => (
                  <li key={f.id}>
                    <span>{f.label}</span>
                    <span>{f.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(settings.social?.length ?? 0) > 0 && (
            <ul className="social-links" style={{ marginTop: '3rem' }}>
              {settings.social!.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.platform} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  )
}
