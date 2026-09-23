import React from 'react'
import type { Payload } from 'payload'

type Props = { payload: Payload }

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  padding: '20px 22px',
  borderRadius: 4,
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
}

const statusColors: Record<string, string> = {
  new: '#b8894f',
  contacted: '#5b7a99',
  'follow-up': '#8a6fa8',
  booked: '#4f8a64',
  declined: '#999',
  archived: '#bbb',
}

export const Dashboard = async ({ payload }: Props) => {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const [inquiries, newInquiries, upcoming, projects, services, testimonials, recentInquiries, recentProjects, recentPosts] =
    await Promise.all([
      payload.count({ collection: 'inquiries' }),
      payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } } }),
      payload.find({
        collection: 'availability',
        where: { and: [{ status: { equals: 'booked' } }, { date: { greater_than_equal: today.toISOString() } }] },
        sort: 'date',
        limit: 5,
        depth: 0,
      }),
      payload.count({ collection: 'projects' }),
      payload.count({ collection: 'services' }),
      payload.count({ collection: 'testimonials' }),
      payload.find({ collection: 'inquiries', sort: '-createdAt', limit: 6, depth: 0 }),
      payload.find({ collection: 'projects', sort: '-updatedAt', limit: 3, depth: 0, draft: true }),
      payload.find({ collection: 'posts', sort: '-updatedAt', limit: 3, depth: 0, draft: true }),
    ])

  const stats = [
    { label: 'Total inquiries', value: inquiries.totalDocs, href: '/admin/collections/inquiries' },
    {
      label: 'New inquiries',
      value: newInquiries.totalDocs,
      href: '/admin/collections/inquiries?where[status][equals]=new',
      highlight: newInquiries.totalDocs > 0,
    },
    { label: 'Upcoming bookings', value: upcoming.totalDocs, href: '/admin/availability-calendar' },
    { label: 'Portfolio projects', value: projects.totalDocs, href: '/admin/collections/projects' },
    { label: 'Services', value: services.totalDocs, href: '/admin/collections/services' },
    { label: 'Testimonials', value: testimonials.totalDocs, href: '/admin/collections/testimonials' },
  ]

  const activity = [
    ...recentProjects.docs.map((d) => ({ type: 'Project', title: d.title, at: d.updatedAt, href: `/admin/collections/projects/${d.id}` })),
    ...recentPosts.docs.map((d) => ({ type: 'Journal', title: d.title, at: d.updatedAt, href: `/admin/collections/posts/${d.id}` })),
    ...recentInquiries.docs.slice(0, 3).map((d) => ({ type: 'Inquiry', title: d.name, at: d.createdAt, href: `/admin/collections/inquiries/${d.id}` })),
  ]
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 8)

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 6px' }}>Welcome back</h2>
      <p style={{ opacity: 0.65, margin: '0 0 24px' }}>
        Here’s what’s happening with RB Studio.{' '}
        <a href="/" target="_blank" rel="noreferrer">
          View website ↗
        </a>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 28 }}>
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            style={{ ...card, borderColor: s.highlight ? '#b8894f' : 'var(--theme-elevation-150)' }}
          >
            <div style={{ fontSize: 34, fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.6, marginTop: 6 }}>
              {s.label}
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <section style={card}>
          <h4 style={{ margin: '0 0 12px' }}>Latest inquiries</h4>
          {recentInquiries.docs.length === 0 && <p style={{ opacity: 0.6 }}>No inquiries yet.</p>}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recentInquiries.docs.map((i) => (
              <li key={i.id} style={{ padding: '8px 0', borderTop: '1px solid var(--theme-elevation-100)' }}>
                <a href={`/admin/collections/inquiries/${i.id}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, textDecoration: 'none', color: 'inherit' }}>
                  <span>
                    <strong>{i.name}</strong>
                    <span style={{ opacity: 0.6 }}> · {i.service || 'General'}</span>
                  </span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: statusColors[i.status] }}>
                    {i.status}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section style={card}>
          <h4 style={{ margin: '0 0 12px' }}>Upcoming bookings</h4>
          {upcoming.docs.length === 0 && <p style={{ opacity: 0.6 }}>No upcoming booked dates.</p>}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {upcoming.docs.map((d) => (
              <li key={d.id} style={{ padding: '8px 0', borderTop: '1px solid var(--theme-elevation-100)' }}>
                <strong>{fmt(d.date)}</strong>
                {d.label && <span style={{ opacity: 0.6 }}> · {d.label}</span>}
                {d.note && <div style={{ fontSize: 12, opacity: 0.6 }}>{d.note}</div>}
              </li>
            ))}
          </ul>
          <a href="/admin/availability-calendar" style={{ fontSize: 13 }}>
            Open calendar →
          </a>
        </section>

        <section style={card}>
          <h4 style={{ margin: '0 0 12px' }}>Recent activity</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {activity.map((a) => (
              <li key={a.href} style={{ padding: '8px 0', borderTop: '1px solid var(--theme-elevation-100)' }}>
                <a href={a.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.55 }}>{a.type}</span>{' '}
                  {a.title} <span style={{ opacity: 0.5, fontSize: 12 }}>· {fmt(a.at)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
