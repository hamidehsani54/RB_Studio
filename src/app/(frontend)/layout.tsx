import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import React from 'react'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'
import { CookieConsent } from '@/components/site/CookieConsent'
import { JsonLd } from '@/components/site/JsonLd'
import { getAbout, getSettings, isDraft } from '@/lib/data'
import { absoluteUrl, asMedia, ogImageUrl, serverUrl } from '@/lib/utils'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const FALLBACK_LOGO = '/brand/rb-studio-logo.png'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const favicon = asMedia(settings.favicon)?.url || asMedia(settings.logo)?.url || FALLBACK_LOGO
  const og = ogImageUrl(settings.ogImage)
  return {
    metadataBase: new URL(serverUrl()),
    title: {
      default: settings.seoTitle || settings.siteName,
      template: `%s${settings.seoTitleSuffix ?? ''}`,
    },
    description: settings.seoDescription || undefined,
    applicationName: settings.siteName,
    icons: { icon: favicon, apple: favicon },
    openGraph: {
      siteName: settings.siteName,
      type: 'website',
      locale: 'en_GB',
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export const viewport: Viewport = {
  themeColor: '#f6f3ee',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, about, draft] = await Promise.all([getSettings(), getAbout(), isDraft()])
  const logoUrl = asMedia(settings.logo)?.url || FALLBACK_LOGO
  const location = about.location || [settings.city, settings.country].filter(Boolean).join(', ')

  // Local business structured data (Google): photographer, location, service area, social profiles.
  const business = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${serverUrl()}/#business`,
    name: settings.siteName,
    description: settings.seoDescription || undefined,
    url: serverUrl(),
    logo: absoluteUrl(logoUrl),
    image: ogImageUrl(settings.ogImage) || absoluteUrl(logoUrl),
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    priceRange: settings.priceRange || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.street || undefined,
      postalCode: settings.postalCode || undefined,
      addressLocality: settings.city || undefined,
      addressRegion: settings.region || undefined,
      addressCountry: settings.country || undefined,
    },
    geo:
      settings.latitude && settings.longitude
        ? { '@type': 'GeoCoordinates', latitude: settings.latitude, longitude: settings.longitude }
        : undefined,
    areaServed: (settings.serviceAreas ?? []).map((a) => ({ '@type': 'Place', name: a.name })),
    sameAs: (settings.social ?? []).map((s) => s.url),
    founder: about.name
      ? { '@type': 'Person', name: settings.photographerName || about.name, jobTitle: about.role || 'Photographer' }
      : undefined,
  }

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header
          siteName={settings.siteName}
          logoUrl={logoUrl}
          links={(settings.headerLinks ?? []).map((l) => ({ label: l.label, url: l.url }))}
          cta={settings.headerCtaLabel ? { label: settings.headerCtaLabel, url: settings.headerCtaUrl || '/contact' } : null}
          email={settings.email}
          phone={settings.phone}
          location={location}
        />
        <main id="main">{children}</main>
        <Footer settings={settings} about={about} logoUrl={logoUrl} />
        <Reveal />
        <CookieConsent
          enabled={Boolean(settings.cookieBannerEnabled)}
          text={settings.cookieText}
          policyUrl={settings.cookiePolicyUrl}
          ga4Id={settings.ga4Id}
          gtmId={settings.gtmId}
          metaPixelId={settings.metaPixelId}
        />
        <JsonLd data={business} />
        {draft && (
          <div className="draft-banner">
            Preview mode
            <a href="/next/exit-preview">Exit</a>
          </div>
        )}
      </body>
    </html>
  )
}
