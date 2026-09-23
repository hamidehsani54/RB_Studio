import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Payload, PayloadRequest } from 'payload'
import type { User } from '@/payload-types'
import { ensureUser, getTestPayload, unique } from '../helpers/payload'

// The contact form's server action reads the visitor's IP from request headers.
const state = vi.hoisted(() => ({ ip: '10.0.0.1' }))
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': state.ip }),
  draftMode: async () => ({ isEnabled: false }),
}))

const { submitInquiry } = await import('@/app/(frontend)/actions')

let payload: Payload
let admin: User

const form = (fields: Record<string, string>) => {
  const fd = new FormData()
  fd.set('started', String(Date.now() - 10_000))
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const valid = (email: string) =>
  form({
    name: 'Anna Svensson',
    email,
    phone: '070 123 45 67',
    service: 'Wedding Photography',
    package: 'Signature',
    eventDate: '2027-06-12',
    location: 'Stockholm',
    budget: '25 000 – 40 000 SEK',
    hours: '8 hours',
    message: 'We would love to hear about availability.',
    consent: 'on',
  })

const countByEmail = async (email: string) =>
  (await payload.count({ collection: 'inquiries', where: { email: { equals: email } } })).totalDocs

beforeAll(async () => {
  payload = await getTestPayload()
  admin = await ensureUser(payload, 'admin')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { siteName: 'RB Studio', email: 'studio@test.local', autoReplyEnabled: false },
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('contact form (server action)', () => {
  it('rejects an invalid email and missing consent, and returns the typed values', async () => {
    state.ip = '10.0.0.2'
    const email = `${unique('bad')}`
    const res = await submitInquiry({ ok: false }, form({ name: 'Anna', email }))
    expect(res.ok).toBe(false)
    expect(res.errors?.email).toBeTruthy()
    expect(res.errors?.consent).toBeTruthy()
    expect(res.values?.name).toBe('Anna')
    expect(await countByEmail(email)).toBe(0)
  })

  it('requires a name', async () => {
    state.ip = '10.0.0.3'
    const res = await submitInquiry({ ok: false }, form({ email: 'a@b.se', consent: 'on' }))
    expect(res.errors?.name).toBeTruthy()
  })

  it('silently drops bots that fill in the hidden honeypot field', async () => {
    state.ip = '10.0.0.4'
    const email = `${unique('bot')}@spam.test`
    const fd = valid(email)
    fd.set('company', 'Spam Inc')
    const res = await submitInquiry({ ok: false }, fd)
    expect(res.ok).toBe(true)
    expect(await countByEmail(email)).toBe(0)
  })

  it('silently drops forms submitted faster than a human could', async () => {
    state.ip = '10.0.0.5'
    const email = `${unique('fast')}@spam.test`
    const fd = valid(email)
    fd.set('started', String(Date.now()))
    await submitInquiry({ ok: false }, fd)
    expect(await countByEmail(email)).toBe(0)
  })

  it('saves a valid inquiry with status "New" and notifies the photographer', async () => {
    state.ip = '10.0.0.6'
    const send = vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)
    const email = `${unique('anna')}@client.test`
    const res = await submitInquiry({ ok: false }, valid(email))
    expect(res.ok).toBe(true)

    const { docs } = await payload.find({ collection: 'inquiries', where: { email: { equals: email } } })
    expect(docs).toHaveLength(1)
    const inq = docs[0]
    expect(inq.status).toBe('new')
    expect(inq.consent).toBe(true)
    expect(inq.package).toBe('Signature')
    expect(inq.eventDate).toBe('2027-06-12T12:00:00.000Z')
    expect(inq.budget).toBe('25 000 – 40 000 SEK')

    expect(send).toHaveBeenCalledTimes(1)
    const mail = send.mock.calls[0][0] as { to: string; replyTo: string; subject: string }
    expect(mail.to).toBe('studio@test.local')
    expect(mail.replyTo).toBe(email)
    expect(mail.subject).toContain('Anna Svensson')
  })

  it('also sends the automatic reply to the client when enabled', async () => {
    state.ip = '10.0.0.7'
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { autoReplyEnabled: true, autoReplySubject: 'Thanks!', autoReplyText: 'Hi {name}, thank you.' },
    })
    const send = vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)
    const email = `${unique('auto')}@client.test`
    await submitInquiry({ ok: false }, valid(email))
    expect(send).toHaveBeenCalledTimes(2)
    const reply = send.mock.calls[1][0] as { to: string; text: string }
    expect(reply.to).toBe(email)
    expect(reply.text).toBe('Hi Anna Svensson, thank you.')
    await payload.updateGlobal({ slug: 'site-settings', data: { autoReplyEnabled: false } })
  })

  it('still saves the inquiry if the email server fails', async () => {
    state.ip = '10.0.0.8'
    vi.spyOn(payload, 'sendEmail').mockRejectedValue(new Error('SMTP down'))
    const email = `${unique('smtp')}@client.test`
    const res = await submitInquiry({ ok: false }, valid(email))
    expect(res.ok).toBe(true)
    expect(await countByEmail(email)).toBe(1)
  })

  it('rate-limits one visitor to 5 inquiries per 10 minutes', async () => {
    state.ip = '10.0.0.99'
    vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)
    for (let i = 0; i < 5; i++) {
      const r = await submitInquiry({ ok: false }, valid(`${unique('rl')}@client.test`))
      expect(r.ok).toBe(true)
    }
    const blocked = await submitInquiry({ ok: false }, valid(`${unique('rl')}@client.test`))
    expect(blocked.ok).toBe(false)
    expect(blocked.message).toMatch(/too many/i)
  })
})

describe('inquiry management (CRM)', () => {
  it('supports all statuses and internal notes', async () => {
    const inq = await payload.create({ collection: 'inquiries', data: { name: 'CRM', email: 'crm@client.test', status: 'new' } })
    for (const status of ['contacted', 'follow-up', 'booked', 'declined', 'archived'] as const) {
      const u = await payload.update({ collection: 'inquiries', id: inq.id, data: { status } })
      expect(u.status).toBe(status)
    }
    const withNote = await payload.update({
      collection: 'inquiries',
      id: inq.id,
      data: { internalNotes: [{ note: 'Called, sending offer' }] },
    })
    expect(withNote.internalNotes?.[0].note).toBe('Called, sending offer')
    expect(withNote.internalNotes?.[0].date).toBeTruthy()
  })

  it('can be searched by name, email or message', async () => {
    const tag = unique('needle')
    await payload.create({ collection: 'inquiries', data: { name: 'Search me', email: 's@client.test', message: `hello ${tag}`, status: 'new' } })
    const res = await payload.find({ collection: 'inquiries', where: { message: { like: tag } } })
    expect(res.totalDocs).toBe(1)
  })

  describe('CSV export', () => {
    const exportHandler = () => {
      const endpoint = payload.collections.inquiries.config.endpoints
      const e = Array.isArray(endpoint) ? endpoint.find((x) => x.path === '/export') : undefined
      if (!e) throw new Error('export endpoint missing')
      return e.handler
    }

    it('refuses visitors who are not logged in', async () => {
      const res = await exportHandler()({ payload, user: null, query: {} } as unknown as PayloadRequest)
      expect(res.status).toBe(401)
    })

    it('exports inquiries as a CSV file that respects filters', async () => {
      const name = unique('Export')
      await payload.create({ collection: 'inquiries', data: { name, email: 'e@client.test', status: 'booked', message: 'Line, with comma' } })
      const res = await exportHandler()({
        payload,
        user: admin,
        query: { where: { status: { equals: 'booked' } } },
      } as unknown as PayloadRequest)
      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toContain('text/csv')
      expect(res.headers.get('Content-Disposition')).toMatch(/attachment; filename="rb-studio-inquiries-/)
      const text = await res.text()
      const lines = text.replace('﻿', '').split('\n')
      expect(lines[0]).toBe('createdAt,status,name,email,phone,service,package,eventDate,location,budget,hours,message')
      expect(text).toContain(name)
      expect(text).toContain('"Line, with comma"')
      lines.slice(1).forEach((l) => expect(l.split(',')[1]).toBe('booked'))
    })
  })
})
