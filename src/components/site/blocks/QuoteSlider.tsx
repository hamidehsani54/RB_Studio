'use client'
import React, { useState } from 'react'
import { Img } from '../Img'
import type { Media } from '@/payload-types'
import { cx, pad2 } from '@/lib/utils'

export type QuoteItem = {
  id: number
  quote: string
  name: string
  meta: string
  image?: Media | null
}

export function QuoteSlider({ items }: { items: QuoteItem[] }) {
  const [active, setActive] = useState(0)
  const go = (delta: number) => setActive((a) => (a + delta + items.length) % items.length)

  return (
    <div
      className="quote-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {items.map((t, i) => (
        <figure
          key={t.id}
          className={cx('quote-slide', i === active && 'is-active')}
          aria-hidden={i !== active}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${items.length}`}
        >
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            {t.image && (
              <span className="quote-avatar">
                <Img media={t.image} sizes="64px" alt="" />
              </span>
            )}
            <span className="small-caps">{t.name}</span>
            {t.meta && <span className="muted" style={{ fontSize: '0.85rem' }}>{t.meta}</span>}
          </figcaption>
        </figure>
      ))}
      {items.length > 1 && (
        <div className="quote-controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial">
            ←
          </button>
          <span className="quote-count" aria-live="polite">
            {pad2(active + 1)} / {pad2(items.length)}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial">
            →
          </button>
        </div>
      )}
    </div>
  )
}
