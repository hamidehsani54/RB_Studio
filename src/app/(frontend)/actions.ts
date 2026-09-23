'use server'
import { headers } from 'next/headers'
import { getClient } from '@/lib/data'

export type InquiryState = { ok: boolean; errors?: Record<string, string>; message?: string; values?: Record<string, string> }

// Simple in-memory rate limit: max 5 inquiries per IP per 10 minutes.
const hits = new Map<string, number[]>()
const WINDOW = 10 * 60 * 1000

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? '').trim().slice(0, max)

export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Spam protection: hidden honeypot field + minimum time on the page.
  if (str(fd, 'company')) return { ok: true }
  const started = Number(fd.get('started') || 0)
  if (started && Date.now() - started < 2500) return { ok: true }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') || h.get('x-real-ip') || 'local').split(',')[0].trim()
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  if (recent.length >= 5) {
    return { ok: false, message: 'Too many messages in a short time — please try again in a few minutes or email directly.' }
  }

  const data = {
    name: str(fd, 'name', 120),
    email: str(fd, 'email', 200),
    phone: str(fd, 'phone', 60),
    service: str(fd, 'service', 120),
    package: str(fd, 'package', 120),
    eventDate: str(fd, 'eventDate', 20),
    location: str(fd, 'location', 200),
    budget: str(fd, 'budget', 120),
    hours: str(fd, 'hours', 60),
    message: str(fd, 'message', 5000),
    consent: fd.get('consent') === 'on',
    sourcePage: str(fd, 'sourcePage', 300),
  }

  const errors: Record<string, string> = {}
  if (!data.name) errors.name = 'Please tell me your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (!data.consent) errors.consent = 'Please accept so I can store your details and reply.'
  if (data.eventDate && Number.isNaN(Date.parse(data.eventDate))) errors.eventDate = 'Please choose a valid date.'
  const values = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
  if (Object.keys(errors).length) return { ok: false, errors, values }

  try {
    const payload = await getClient()
    await payload.create({
      collection: 'inquiries',
      data: {
        ...data,
        eventDate: data.eventDate ? `${data.eventDate}T12:00:00.000Z` : undefined,
        status: 'new',
      },
      overrideAccess: true,
    })
    hits.set(ip, [...recent, now])
    return { ok: true }
  } catch (err) {
    console.error('Inquiry failed', err)
    return { ok: false, values, message: 'Something went wrong. Please try again, or email directly.' }
  }
}
