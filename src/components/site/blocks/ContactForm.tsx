'use client'
import Link from 'next/link'
import React, { useActionState, useEffect, useRef, useState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/(frontend)/actions'

type Option = { value: string; label: string }

type Props = {
  services: Option[]
  packages: (Option & { service?: string })[]
  budgetOptions: string[]
  hoursOptions: string[]
  consentText: string
  privacyUrl: string
  successHeading: string
  successMessage: string
  intro?: string | null
}

const initial: InquiryState = { ok: false }

export function ContactForm(props: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const [started] = useState(() => Date.now())
  const [service, setService] = useState('')
  const [pkg, setPkg] = useState('')
  const [date, setDate] = useState('')
  const [source, setSource] = useState('')
  const successRef = useRef<HTMLDivElement>(null)

  // Pre-fill from links such as /contact?package=signature or ?service=weddings&date=2027-06-12
  useEffect(() => {
    setSource(window.location.pathname)
    const q = new URLSearchParams(window.location.search)
    const p = props.packages.find((x) => x.value === q.get('package'))
    if (p) {
      setPkg(p.label)
      if (p.service) setService(p.service)
    }
    const s = props.services.find((x) => x.value === q.get('service'))
    if (s) setService(s.label)
    const d = q.get('date')
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) setDate(d)
  }, [props.packages, props.services])

  useEffect(() => {
    if (state.ok) successRef.current?.focus()
  }, [state.ok])

  if (state.ok) {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <h3 className="h2">{props.successHeading}</h3>
        <p>{props.successMessage}</p>
      </div>
    )
  }

  const err = state.errors ?? {}
  const v = state.values ?? {}
  const invalid = (k: string) => (err[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-error` } : {})
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={action} className="form" noValidate id="inquiry">
      {props.intro && <p className="span-2 muted" style={{ margin: 0 }}>{props.intro}</p>}
      <input type="hidden" name="started" value={started} />
      <input type="hidden" name="sourcePage" value={source} />
      <div className="hp" aria-hidden="true">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="f-name">Name *</label>
        <input id="f-name" name="name" defaultValue={v.name} autoComplete="name" required {...invalid('name')} />
        {err.name && <span className="field__error" id="name-error">{err.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="f-email">Email *</label>
        <input id="f-email" name="email" defaultValue={v.email} type="email" autoComplete="email" required {...invalid('email')} />
        {err.email && <span className="field__error" id="email-error">{err.email}</span>}
      </div>
      <div className="field">
        <label htmlFor="f-phone">Phone</label>
        <input id="f-phone" name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="f-service">Service</label>
        <select id="f-service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">Choose…</option>
          {props.services.map((s) => (
            <option key={s.value} value={s.label}>
              {s.label}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>
      {props.packages.length > 0 && (
        <div className="field">
          <label htmlFor="f-package">Package</label>
          <select id="f-package" name="package" value={pkg} onChange={(e) => setPkg(e.target.value)}>
            <option value="">Not sure yet</option>
            {props.packages.map((p) => (
              <option key={p.value} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="f-date">Event / wedding date</label>
        <input id="f-date" name="eventDate" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} {...invalid('eventDate')} />
        {err.eventDate && <span className="field__error" id="eventDate-error">{err.eventDate}</span>}
      </div>
      <div className="field">
        <label htmlFor="f-location">Location</label>
        <input id="f-location" name="location" defaultValue={v.location} placeholder="City, venue…" />
      </div>
      {props.budgetOptions.length > 0 ? (
        <div className="field">
          <label htmlFor="f-budget">Estimated budget</label>
          <select id="f-budget" name="budget" defaultValue={v.budget ?? ""}>
            <option value="">Choose…</option>
            {props.budgetOptions.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="f-budget">Estimated budget</label>
          <input id="f-budget" name="budget" defaultValue={v.budget} />
        </div>
      )}
      {props.hoursOptions.length > 0 ? (
        <div className="field">
          <label htmlFor="f-hours">Number of hours</label>
          <select id="f-hours" name="hours" defaultValue={v.hours ?? ""}>
            <option value="">Choose…</option>
            {props.hoursOptions.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="f-hours">Number of hours</label>
          <input id="f-hours" name="hours" defaultValue={v.hours} />
        </div>
      )}
      <div className="field span-2">
        <label htmlFor="f-message">Tell me about your day</label>
        <textarea id="f-message" name="message" defaultValue={v.message} rows={6} placeholder="Who you are, what you’re planning, what matters most to you…" />
      </div>
      <div className="span-2">
        <label className="checkbox">
          <input type="checkbox" name="consent" defaultChecked={v.consent === "true"} required {...invalid('consent')} />
          <span>
            {props.consentText} <Link href={props.privacyUrl}>Privacy policy</Link>.
          </span>
        </label>
        {err.consent && <span className="field__error" id="consent-error">{err.consent}</span>}
      </div>
      <div className="span-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
        <button type="submit" className="btn btn--solid" disabled={pending}>
          {pending ? 'Sending…' : 'Send inquiry'}
        </button>
        {state.message && (
          <p className="form-status" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}
