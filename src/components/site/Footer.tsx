import Link from 'next/link'
import React from 'react'
import type { About, SiteSetting } from '@/payload-types'
import { getServices } from '@/lib/data'
import { CookieSettingsButton } from './CookieConsent'

const platformName: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
  vimeo: 'Vimeo',
  other: 'Link',
}

export async function Footer({ settings, about, logoUrl }: { settings: SiteSetting; about: About; logoUrl: string }) {
  const services = await getServices()
  const nav = settings.footerLinks?.length ? settings.footerLinks : settings.headerLinks ?? []
  const year = new Date().getFullYear()
  const copyright = (settings.copyright || `© {year} ${settings.siteName}`).replace('{year}', String(year))
  const location = about.location || [settings.city, settings.country].filter(Boolean).join(', ')

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <p className="h2" style={{ fontFamily: 'var(--serif)', margin: 0 }}>
            {settings.footerHeading}
          </p>
          {settings.headerCtaLabel && (
            <Link href={settings.headerCtaUrl || '/contact'} className="btn">
              {settings.headerCtaLabel} <span className="arrow">→</span>
            </Link>
          )}
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={settings.siteName} width={88} height={88} loading="lazy" />
            {settings.footerText && <p>{settings.footerText}</p>}
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h2>Explore</h2>
            <ul>
              {nav.map((l) => (
                <li key={l.url}>
                  <Link href={l.url}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {services.length > 0 && (
            <div className="footer-col">
              <h2>Services</h2>
              <ul>
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="footer-col">
            <h2>Contact</h2>
            <ul>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </li>
              )}
              {location && <li>{location}</li>}
            </ul>
          </div>

          {(settings.social?.length ?? 0) > 0 && (
            <div className="footer-col">
              <h2>Follow</h2>
              <ul>
                {settings.social!.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {platformName[s.platform] ?? s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <span>{copyright}</span>
          <ul>
            {(settings.legalLinks ?? []).map((l) => (
              <li key={l.url}>
                <Link href={l.url}>{l.label}</Link>
              </li>
            ))}
            {settings.cookieBannerEnabled && (settings.ga4Id || settings.gtmId || settings.metaPixelId) && (
              <li>
                <CookieSettingsButton />
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}
