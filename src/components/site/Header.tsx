'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { cx, pad2 } from '@/lib/utils'

type NavLink = { label: string; url: string }

type Props = {
  siteName: string
  logoUrl: string
  links: NavLink[]
  cta?: NavLink | null
  email?: string | null
  phone?: string | null
  location?: string | null
}

export function Header({ siteName, logoUrl, links, cta, email, phone, location }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Transparent header only on pages that start with a full-bleed photograph.
  useEffect(() => {
    const el = document.querySelector('main [data-header-overlay]') as HTMLElement | null
    setOverlay(Boolean(el && el.getBoundingClientRect().top + window.scrollY < 10))
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Hide while scrolling down deep into a page, reveal when scrolling up.
      if (y < 600 || y < last - 6) setHidden(false)
      else if (y > last + 6) setHidden(true)
      if (Math.abs(y - last) > 6) last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      menuRef.current?.querySelector('a')?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false)
          toggleRef.current?.focus()
        }
        // Keep keyboard focus inside the open menu.
        if (e.key === 'Tab' && menuRef.current) {
          const focusables = [toggleRef.current, ...Array.from(menuRef.current.querySelectorAll<HTMLElement>('a'))].filter(
            Boolean,
          ) as HTMLElement[]
          const first = focusables[0]
          const lastEl = focusables[focusables.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            lastEl.focus()
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault()
            first.focus()
          }
        }
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isCurrent = (url: string) => (url === '/' ? pathname === '/' : pathname.startsWith(url))

  return (
    <>
      <header
        className={cx(
          'site-header',
          overlay && !scrolled && !open && 'is-overlay',
          scrolled && 'is-compact',
          hidden && !open && 'is-hidden',
        )}
      >
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label={`${siteName} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand__logo" src={logoUrl} alt="" width={52} height={52} />
            <span className="sr-only">{siteName}</span>
          </Link>

          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.url} href={l.url} className="nav__link" aria-current={isCurrent(l.url) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {cta?.label && (
              <Link href={cta.url} className="btn header-cta">
                {cta.label}
              </Link>
            )}
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle__icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={cx('mobile-menu', open && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {[{ label: 'Home', url: '/' }, ...links].map((l, i) => (
              <li key={l.url}>
                <Link
                  href={l.url}
                  style={{ ['--i' as string]: i }}
                  aria-current={isCurrent(l.url) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <small>{pad2(i + 1)}</small>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          {cta?.label && (
            <Link href={cta.url} className="btn" onClick={() => setOpen(false)}>
              {cta.label}
            </Link>
          )}
          <div>
            {email && (
              <div>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
            {phone && (
              <div>
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </div>
            )}
            {location && <div>{location}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
