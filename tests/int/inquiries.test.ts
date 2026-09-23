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

const { submitInquiry, checkDateAvailability } = await import('@/app/(frontend)/actions')

let payload: Payload
let admin: User

type Mail = { to: string; replyTo?: string; subject: string; text?: string; html?: string }

// Every test uses its own future day so tests never collide.
let dayOffset = 400
const nextDay = () => {
  const d = new Date(Date.UTC(2040, 0, 1) + dayOffset++ * 864e5) // far from dates used by other test files
  return d.toISOString().slice(0, 10)
}

const form = (fields: Record<string, string>) => {
  const fd = new FormData()
  fd.set('started', String(Date.now() - 10_000))
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const valid = (email: string, eventDate = nextDay()) =>
  form({
    name: 'Anna Svensson',
    email,
    phone: '070 123 45 67',
    service: 'Wedding Photography',
    package: 'Signature',
    eventDate,
    location: 'Stockholm',
    budget: '25 000 – 40 000 SEK',
    hours: '8 hours',
    message: 'We would love to hear about availability.',
    consent: 'on',
  })

const countByEmail = async (email: string) =>
  (await payload.count({ collection: 'inquiries', where: { email: { equals: email } } })).totalDocs

const inquiryByEmail = async (email: string) =>
  (await payload.find({ collection: 'inquiries', where: { email: { equals: email } }, limit: 1 })).docs[0]

const dayEntry = async (day: string) =>
  (await payload.find({ collection: 'availability', where: { date: { equals: `${day}T12:00:00.000Z` } }, limit: 1 }))
    .docs[0]

const mailSpy = () => vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never)
const sent = (spy: ReturnType<typeof mailSpy>) => spy.mock.calls.map((c) => c[0] as Mail)

beforeAll(async () => {
  payload = await getTestPayload()
  admin = await ensureUser(payload, 'admin')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { siteName: 'RB Studio', email: 'studio@test.local', sendClientEmails: true },
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

  it('rate-limits one visitor to 5 requests per 10 minutes', async () => {
    state.ip = '10.0.0.99'
    mailSpy()
    for (let i = 0; i < 5; i++) {
      const r = await submitInquiry({ ok: false }, valid(`${unique('rl')}@client.test`))
      expect(r.ok).toBe(true)
    }
    const blocked = await submitInquiry({ ok: false }, valid(`${unique('rl')}@client.test`))
    expect(blocked.ok).toBe(false)
    expect(blocked.message).toMatch(/too many/i)
  })
})

describe('booking request → emails and reservation', () => {
  it('saves the request, reserves the day and sends the "request received" email + studio notification', async () => {
    state.ip = '10.0.1.1'
    const spy = mailSpy()
    const email = `${unique('anna')}@client.test`
    const day = nextDay()
    const res = await submitInquiry({ ok: false }, valid(email, day))
    expect(res.ok).toBe(true)

    const inq = await inquiryByEmail(email)
    expect(inq.status).toBe('new')
    expect(inq.eventDate).toBe(`${day}T12:00:00.000Z`)

    const entry = await dayEntry(day)
    expect(entry?.status).toBe('tentative')
    expect(typeof entry?.inquiry === 'object' ? entry?.inquiry?.id : entry?.inquiry).toBe(inq.id)

    const mails = sent(spy)
    expect(mails).toHaveLength(2)
    const studio = mails.find((m) => m.to === 'studio@test.local')!
    const client = mails.find((m) => m.to === email)!
    expect(studio.subject).toContain('New booking request — Anna Svensson')
    expect(studio.replyTo).toBe(email)
    expect(client.subject).toBe('We received your booking request — RB Studio')
    expect(client.text).toContain('Hi Anna Svensson')
    expect(client.text).toMatch(/is now reserved for you/)
    expect(client.html).toContain('Booking request received')
  })

  it('refuses a second request for a day that is already reserved', async () => {
    state.ip = '10.0.1.2'
    mailSpy()
    const day = nextDay()
    expect((await submitInquiry({ ok: false }, valid(`${unique('first')}@client.test`, day))).ok).toBe(true)

    const secondEmail = `${unique('second')}@client.test`
    const second = await submitInquiry({ ok: false }, valid(secondEmail, day))
    expect(second.ok).toBe(false)
    expect(second.errors?.eventDate).toMatch(/already booked/i)
    expect(await countByEmail(secondEmail)).toBe(0)
  })

  it('reports availability for the live date check', async () => {
    state.ip = '10.0.1.3'
    mailSpy()
    const day = nextDay()
    expect(await checkDateAvailability(day)).toEqual({ available: true })
    await submitInquiry({ ok: false }, valid(`${unique('chk')}@client.test`, day))
    expect(await checkDateAvailability(day)).toEqual({ available: false })
  })

  it('lets a request take a day the photographer marked "available"', async () => {
    state.ip = '10.0.1.4'
    mailSpy()
    const day = nextDay()
    await payload.create({ collection: 'availability', data: { date: `${day}T12:00:00.000Z`, status: 'available' } })
    const r = await submitInquiry({ ok: false }, valid(`${unique('avail')}@client.test`, day))
    expect(r.ok).toBe(true)
    expect((await dayEntry(day))?.status).toBe('tentative')
  })

  it('does not reserve anything for requests without a date', async () => {
    state.ip = '10.0.1.5'
    const spy = mailSpy()
    const email = `${unique('nodate')}@client.test`
    const fd = valid(email)
    fd.delete('eventDate')
    expect((await submitInquiry({ ok: false }, fd)).ok).toBe(true)
    const inq = await inquiryByEmail(email)
    const linked = await payload.count({ collection: 'availability', where: { inquiry: { equals: inq.id } } })
    expect(linked.totalDocs).toBe(0)
    expect(sent(spy).find((m) => m.to === email)?.text).toContain('your requested date')
  })

  it('still saves the request if the email server fails', async () => {
    state.ip = '10.0.1.6'
    vi.spyOn(payload, 'sendEmail').mockRejectedValue(new Error('SMTP down'))
    const email = `${unique('smtp')}@client.test`
    const res = await submitInquiry({ ok: false }, valid(email))
    expect(res.ok).toBe(true)
    expect(await countByEmail(email)).toBe(1)
  })

  it('can switch client emails off in Site settings', async () => {
    state.ip = '10.0.1.7'
    await payload.updateGlobal({ slug: 'site-settings', data: { sendClientEmails: false } })
    const spy = mailSpy()
    const email = `${unique('off')}@client.test`
    await submitInquiry({ ok: false }, valid(email))
    expect(sent(spy).map((m) => m.to)).toEqual(['studio@test.local'])
    await payload.updateGlobal({ slug: 'site-settings', data: { sendClientEmails: true } })
  })

  it('uses the email texts edited in Site settings', async () => {
    state.ip = '10.0.1.8'
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { requestEmailSubject: 'Tack {name}!', requestEmailMessage: 'Hej {name}, {date} är reserverat.' },
    })
    const spy = mailSpy()
    const email = `${unique('custom')}@client.test`
    await submitInquiry({ ok: false }, valid(email, '2031-06-14'))
    const mail = sent(spy).find((m) => m.to === email)!
    expect(mail.subject).toBe('Tack Anna Svensson!')
    expect(mail.text).toBe('Hej Anna Svensson, Saturday, 14 June 2031 är reserverat.')
    await payload.updateGlobal({ slug: 'site-settings', data: { requestEmailSubject: '', requestEmailMessage: '' } })
  })
})

describe('admin managing bookings', () => {
  const createBooking = async (day = nextDay()) => {
    mailSpy()
    const inq = await payload.create({
      collection: 'inquiries',
      data: { name: 'Erik', email: `${unique('erik')}@client.test`, eventDate: `${day}T12:00:00.000Z`, status: 'new' },
    })
    vi.restoreAllMocks()
    return { inq, day }
  }

  it('confirming a booking marks the day booked and sends the confirmation email (once)', async () => {
    const { inq, day } = await createBooking()
    const spy = mailSpy()
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'booked' } })
    expect((await dayEntry(day))?.status).toBe('booked')
    const mails = sent(spy)
    expect(mails).toHaveLength(1)
    expect(mails[0].to).toBe(inq.email)
    expect(mails[0].subject).toBe('Your booking is confirmed — RB Studio')
    expect(mails[0].text).toMatch(/is confirmed/)
    expect(mails[0].html).toContain('Your booking is confirmed')

    // Saving again (e.g. adding a note) must not send a second confirmation.
    await payload.update({ collection: 'inquiries', id: inq.id, data: { internalNotes: [{ note: 'Deposit paid' }] } })
    expect(sent(spy)).toHaveLength(1)
  })

  it('cancelling a booking frees the day immediately', async () => {
    const { inq, day } = await createBooking()
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'booked' } })
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'cancelled' } })
    expect(await dayEntry(day)).toBeUndefined()
    expect(await checkDateAvailability(day)).toEqual({ available: true })
  })

  it('declining a request frees the day', async () => {
    const { inq, day } = await createBooking()
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'declined' } })
    expect(await dayEntry(day)).toBeUndefined()
  })

  it('deleting a booking frees the day', async () => {
    const { inq, day } = await createBooking()
    await payload.delete({ collection: 'inquiries', id: inq.id })
    expect(await dayEntry(day)).toBeUndefined()
  })

  it('editing the date moves the reservation', async () => {
    const { inq, day } = await createBooking()
    const newDay = nextDay()
    await payload.update({ collection: 'inquiries', id: inq.id, data: { eventDate: `${newDay}T12:00:00.000Z` } })
    expect(await dayEntry(day)).toBeUndefined()
    expect((await dayEntry(newDay))?.status).toBe('tentative')
  })

  it('cannot move a booking onto a day that belongs to another booking', async () => {
    const a = await createBooking()
    const b = await createBooking()
    await expect(
      payload.update({ collection: 'inquiries', id: b.inq.id, data: { eventDate: `${a.day}T12:00:00.000Z` } }),
    ).rejects.toThrow(/already booked/i)
    expect((await dayEntry(b.day))?.status).toBe('tentative') // unchanged
  })

  it('re-opening a cancelled booking reserves the day again if it is still free', async () => {
    const { inq, day } = await createBooking()
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'cancelled' } })
    await payload.update({ collection: 'inquiries', id: inq.id, data: { status: 'contacted' } })
    expect((await dayEntry(day))?.status).toBe('tentative')
  })

  it('removing the day in the calendar cancels the booking', async () => {
    const { inq, day } = await createBooking()
    const entry = await dayEntry(day)
    await payload.delete({ collection: 'availability', id: entry!.id })
    const after = await payload.findByID({ collection: 'inquiries', id: inq.id })
    expect(after.status).toBe('cancelled')
  })

  it('setting the day to "available" in the calendar cancels the booking', async () => {
    const { inq, day } = await createBooking()
    const entry = await dayEntry(day)
    await payload.update({ collection: 'availability', id: entry!.id, data: { status: 'available' } })
    expect((await payload.findByID({ collection: 'inquiries', id: inq.id })).status).toBe('cancelled')
    expect(await checkDateAvailability(day)).toEqual({ available: true })
  })

  it('the calendar note names the client and is hidden from the public', async () => {
    const { day } = await createBooking()
    const entry = await dayEntry(day)
    expect(entry?.note).toBe('Booking request — Erik')
    const pub = await payload.findByID({ collection: 'availability', id: entry!.id, overrideAccess: false })
    expect(pub.note).toBeUndefined()
    expect(pub.inquiry).toBeUndefined()
  })
})

describe('inquiry management (CRM)', () => {
  it('supports all statuses and internal notes', async () => {
    const inq = await payload.create({ collection: 'inquiries', data: { name: 'CRM', email: 'crm@client.test', status: 'new' } })
    for (const status of ['contacted', 'follow-up', 'booked', 'declined', 'cancelled', 'archived'] as const) {
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
