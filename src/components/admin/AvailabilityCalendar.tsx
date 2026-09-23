'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type Status = 'booked' | 'tentative' | 'available'
type Entry = { id: number | string; date: string; status: Status; label?: string | null; note?: string | null; inquiry?: number | string | null }

const COLORS: Record<Status, string> = { booked: '#1f1e1c', tentative: '#b8894f', available: '#4f8a64' }
const LABELS: Record<Status, string> = { booked: 'Booked', tentative: 'Tentative', available: 'Available' }
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const pad = (n: number) => String(n).padStart(2, '0')
const keyOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

export const AvailabilityCalendar = () => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ status: Status; label: string; note: string }>({ status: 'booked', label: '', note: '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    // Load a generous window around the visible month.
    const from = new Date(Date.UTC(year, month - 1, 1)).toISOString()
    const to = new Date(Date.UTC(year, month + 2, 1)).toISOString()
    const qs = new URLSearchParams({
      'where[date][greater_than_equal]': from,
      'where[date][less_than]': to,
      limit: '200',
      depth: '0',
    })
    const res = await fetch(`/api/availability?${qs}`, { credentials: 'include' })
    const json = await res.json()
    const map: Record<string, Entry> = {}
    for (const doc of json.docs ?? []) map[String(doc.date).slice(0, 10)] = doc
    setEntries(map)
  }, [year, month])

  useEffect(() => {
    load()
  }, [load])

  const days = useMemo(() => {
    const first = new Date(year, month, 1)
    const offset = (first.getDay() + 6) % 7 // Monday first
    const count = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = Array(offset).fill(null)
    for (let d = 1; d <= count; d++) cells.push(d)
    while (cells.length % 7) cells.push(null)
    return cells
  }, [year, month])

  const select = (key: string) => {
    setSelected(key)
    setMessage('')
    const e = entries[key]
    setDraft({ status: e?.status ?? 'booked', label: e?.label ?? '', note: e?.note ?? '' })
  }

  const move = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
    setSelected(null)
  }

  const save = async () => {
    if (!selected) return
    setBusy(true)
    const existing = entries[selected]
    const body = JSON.stringify({ date: `${selected}T12:00:00.000Z`, ...draft })
    const res = await fetch(existing ? `/api/availability/${existing.id}` : '/api/availability', {
      method: existing ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    setBusy(false)
    setMessage(res.ok ? 'Saved ✓' : 'Could not save — please try again.')
    await load()
  }

  const remove = async () => {
    if (!selected || !entries[selected]) return
    if (!window.confirm(entries[selected].inquiry ? 'This day belongs to a booking. Removing it CANCELS that booking and frees the date. Continue?' : 'Remove this date from the calendar? It will show as free on the website.')) return
    setBusy(true)
    await fetch(`/api/availability/${entries[selected].id}`, { method: 'DELETE', credentials: 'include' })
    setBusy(false)
    setMessage('Removed')
    await load()
  }

  const monthName = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const todayKey = keyOf(now.getFullYear(), now.getMonth(), now.getDate())

  const btn: React.CSSProperties = {
    border: '1px solid var(--theme-elevation-200)',
    background: 'var(--theme-elevation-0)',
    color: 'inherit',
    padding: '6px 14px',
    cursor: 'pointer',
    borderRadius: 3,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', gap: 28, margin: '24px 0 60px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button type="button" style={btn} onClick={() => move(-1)} aria-label="Previous month">
            ←
          </button>
          <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400 }}>{monthName}</h3>
          <button type="button" style={btn} onClick={() => move(1)} aria-label="Next month">
            →
          </button>
        </div>
        <div role="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {WEEKDAYS.map((w) => (
            <div key={w} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, padding: 4 }}>
              {w}
            </div>
          ))}
          {days.map((d, i) => {
            if (!d) return <div key={`e${i}`} />
            const key = keyOf(year, month, d)
            const entry = entries[key]
            const isSel = selected === key
            return (
              <button
                type="button"
                key={key}
                onClick={() => select(key)}
                aria-pressed={isSel}
                aria-label={`${key}${entry ? ` — ${LABELS[entry.status]}` : ''}`}
                style={{
                  minHeight: 74,
                  textAlign: 'left',
                  padding: 8,
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: isSel ? '2px solid var(--theme-elevation-900)' : '1px solid var(--theme-elevation-150)',
                  background: entry ? COLORS[entry.status] : 'var(--theme-elevation-0)',
                  color: entry ? '#fff' : 'inherit',
                  opacity: key < todayKey ? 0.45 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: key === todayKey ? 700 : 400 }}>{d}</span>
                {entry && (
                  <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {LABELS[entry.status]}
                    {entry.note ? ' ✎' : ''}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 14, fontSize: 12 }}>
          {(Object.keys(COLORS) as Status[]).map((s) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: COLORS[s], display: 'inline-block', borderRadius: 2 }} />
              {LABELS[s]}
            </span>
          ))}
          <span style={{ opacity: 0.6 }}>✎ has private note</span>
        </div>
      </div>

      <aside
        style={{
          border: '1px solid var(--theme-elevation-150)',
          padding: 20,
          borderRadius: 4,
          alignSelf: 'start',
          position: 'sticky',
          top: 80,
        }}
      >
        {!selected ? (
          <p style={{ opacity: 0.6, margin: 0 }}>Select a day in the calendar to edit it.</p>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            <h4 style={{ margin: 0 }}>
              {new Date(`${selected}T12:00:00Z`).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h4>
            {entries[selected]?.inquiry && (
              <a href={`/admin/collections/inquiries/${entries[selected].inquiry}`} style={{ fontSize: 13 }}>
                Open booking →
              </a>
            )}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(Object.keys(COLORS) as Status[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraft({ ...draft, status: s })}
                  aria-pressed={draft.status === s}
                  style={{
                    ...btn,
                    background: draft.status === s ? COLORS[s] : btn.background,
                    color: draft.status === s ? '#fff' : 'inherit',
                  }}
                >
                  {LABELS[s]}
                </button>
              ))}
            </div>
            <label style={{ display: 'grid', gap: 4, fontSize: 13 }}>
              Public label (optional)
              <input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="e.g. Gotland"
                style={{ padding: 8, border: '1px solid var(--theme-elevation-200)', background: 'var(--theme-input-bg)', color: 'inherit' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 4, fontSize: 13 }}>
              Private note
              <textarea
                rows={4}
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                placeholder="Client, venue, deposit paid…"
                style={{ padding: 8, border: '1px solid var(--theme-elevation-200)', background: 'var(--theme-input-bg)', color: 'inherit' }}
              />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn--style-primary btn--size-small" style={{ margin: 0 }} disabled={busy} onClick={save}>
                Save
              </button>
              {entries[selected] && (
                <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} disabled={busy} onClick={remove}>
                  Remove
                </button>
              )}
            </div>
            {message && <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>{message}</p>}
          </div>
        )}
      </aside>
    </div>
  )
}
