'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Consent = { analytics: boolean; marketing: boolean; date: string }

type Props = {
  enabled: boolean
  text?: string | null
  policyUrl?: string | null
  ga4Id?: string | null
  gtmId?: string | null
  metaPixelId?: string | null
}

const KEY = 'rb-consent-v1'

const inject = (id: string, code: string, src?: string) => {
  if (document.getElementById(id)) return
  if (src) {
    const s = document.createElement('script')
    s.async = true
    s.src = src
    s.id = `${id}-src`
    document.head.appendChild(s)
  }
  const s = document.createElement('script')
  s.id = id
  s.text = code
  document.head.appendChild(s)
}

const load = (consent: Consent, p: Props) => {
  if (consent.analytics && p.ga4Id) {
    inject(
      'ga4',
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${p.ga4Id}',{anonymize_ip:true});`,
      `https://www.googletagmanager.com/gtag/js?id=${p.ga4Id}`,
    )
  }
  if ((consent.analytics || consent.marketing) && p.gtmId) {
    inject(
      'gtm',
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${p.gtmId}');`,
    )
  }
  if (consent.marketing && p.metaPixelId) {
    inject(
      'meta-pixel',
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${p.metaPixelId}');fbq('track','PageView');`,
    )
  }
}

/**
 * GDPR-friendly consent: nothing but strictly necessary storage runs until the visitor chooses.
 * The banner only appears when an analytics/marketing integration is configured in Site settings.
 */
export function CookieConsent(props: Props) {
  const needsConsent = props.enabled && Boolean(props.ga4Id || props.gtmId || props.metaPixelId)
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (!needsConsent) return
    let stored: Consent | null = null
    try {
      stored = JSON.parse(localStorage.getItem(KEY) || 'null')
    } catch {}
    if (stored) {
      setAnalytics(stored.analytics)
      setMarketing(stored.marketing)
      load(stored, props)
    } else {
      setOpen(true)
    }
    const reopen = () => {
      setDetails(true)
      setOpen(true)
    }
    window.addEventListener('rb:cookie-settings', reopen)
    return () => window.removeEventListener('rb:cookie-settings', reopen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsConsent])

  const save = (c: { analytics: boolean; marketing: boolean }) => {
    const consent = { ...c, date: new Date().toISOString() }
    try {
      localStorage.setItem(KEY, JSON.stringify(consent))
    } catch {}
    setAnalytics(c.analytics)
    setMarketing(c.marketing)
    setOpen(false)
    load(consent, props)
  }

  if (!needsConsent || !open) return null

  return (
    <div className="cookie" role="dialog" aria-live="polite" aria-labelledby="cookie-title">
      <h2 id="cookie-title">Cookies</h2>
      <p>
        {props.text} {props.policyUrl && <Link href={props.policyUrl}>Read more</Link>}
      </p>
      {details && (
        <div className="cookie__options">
          <label>
            <input type="checkbox" checked disabled /> Necessary (always on)
          </label>
          {(props.ga4Id || props.gtmId) && (
            <label>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Analytics
            </label>
          )}
          {(props.metaPixelId || props.gtmId) && (
            <label>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing
            </label>
          )}
        </div>
      )}
      <div className="cookie__actions">
        <button type="button" className="btn btn--solid" onClick={() => save({ analytics: true, marketing: true })}>
          Accept all
        </button>
        <button type="button" className="btn" onClick={() => save({ analytics: false, marketing: false })}>
          Only necessary
        </button>
        {details ? (
          <button type="button" className="btn" onClick={() => save({ analytics, marketing })}>
            Save choices
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setDetails(true)}>
            Settings
          </button>
        )}
      </div>
    </div>
  )
}

export function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('rb:cookie-settings'))}>
      Cookie settings
    </button>
  )
}
