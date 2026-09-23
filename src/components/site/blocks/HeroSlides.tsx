'use client'
import React, { useEffect, useState } from 'react'
import { Img } from '../Img'
import type { Media } from '@/payload-types'
import { cx } from '@/lib/utils'

export function HeroSlides({ slides, interval = 6 }: { slides: Media[]; interval?: number }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setActive((a) => (a + 1) % slides.length), Math.max(3, interval) * 1000)
    return () => window.clearInterval(id)
  }, [slides.length, interval, paused])

  return (
    <>
      <div className="hero__slides" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.id} className={cx('hero__slide', i === active && 'is-active')}>
            {/* Only the first slide is preloaded; the rest load lazily in the background. */}
            <Img media={s} priority={i === 0} sizes="100vw" alt="" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="hero__dots" role="group" aria-label="Slideshow">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Show image ${i + 1}: ${s.alt}`}
              aria-current={i === active}
              onClick={() => {
                setActive(i)
                setPaused(true)
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
