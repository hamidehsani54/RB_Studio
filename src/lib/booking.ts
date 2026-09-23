import { APIError, type PayloadRequest } from 'payload'

/**
 * Booking rules
 * - A booking request (inquiry with a date) reserves that day immediately ("tentative").
 * - Confirming it ("booked") marks the day as booked.
 * - Declining / cancelling / deleting it frees the day again.
 * - A day can only belong to one booking (unique date in the availability table).
 */

export const DATE_TAKEN_MESSAGE = 'This date is already booked. Please choose another date.'

export type InquiryStatus = 'new' | 'contacted' | 'follow-up' | 'booked' | 'declined' | 'cancelled' | 'archived'

/** What each booking status means for the calendar. `keep` leaves the day as it is. */
export const reservationFor = (status?: string | null): 'tentative' | 'booked' | 'release' | 'keep' => {
  switch (status) {
    case 'booked':
      return 'booked'
    case 'declined':
    case 'cancelled':
      return 'release'
    case 'archived':
      return 'keep'
    default:
      return 'tentative' // new, contacted, follow-up
  }
}

/** Calendar day in Stockholm, e.g. "2027-06-12". */
export const stockholmDay = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-CA', { timeZone: 'Europe/Stockholm' })

/** Dates are stored at 12:00 UTC of their Stockholm calendar day so they never shift. */
export const normaliseDate = (value: string | Date) => `${stockholmDay(value)}T12:00:00.000Z`

export const formatLongDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Stockholm',
      })
    : ''

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: number | string }).id : v) as number | string | null

type Ctx = { skipReservationSync?: boolean; disableRevalidate?: boolean }

/** Throws if another booking already holds the day. */
export async function assertDateFree({
  req,
  date,
  inquiryId,
}: {
  req: PayloadRequest
  date: string
  inquiryId?: number | string
}) {
  const { docs } = await req.payload.find({
    collection: 'availability',
    where: { date: { equals: normaliseDate(date) } },
    limit: 1,
    depth: 0,
    req,
  })
  const entry = docs[0]
  if (!entry || entry.status === 'available') return
  if (inquiryId && idOf(entry.inquiry) === inquiryId) return
  throw new APIError(DATE_TAKEN_MESSAGE, 409, null, true)
}

/** Creates, moves, updates or removes the calendar day that belongs to a booking. */
export async function syncReservation({
  req,
  inquiry,
}: {
  req: PayloadRequest
  inquiry: { id: number | string; name?: string | null; status?: string | null; eventDate?: string | null; service?: string | null }
}) {
  const context: Ctx = { ...(req.context as Ctx), skipReservationSync: true }
  const { docs } = await req.payload.find({
    collection: 'availability',
    where: { inquiry: { equals: inquiry.id } },
    limit: 1,
    depth: 0,
    req,
  })
  const current = docs[0]
  const action = reservationFor(inquiry.status)
  if (action === 'keep') return

  if (action === 'release' || !inquiry.eventDate) {
    if (current) await req.payload.delete({ collection: 'availability', id: current.id, req, context })
    return
  }

  const date = normaliseDate(inquiry.eventDate)
  const note = `${action === 'booked' ? 'Confirmed booking' : 'Booking request'} — ${inquiry.name ?? ''}${
    inquiry.service ? ` (${inquiry.service})` : ''
  }`
  const data = { date, status: action, note, inquiry: inquiry.id as number }

  if (current) {
    if (current.date !== date) await assertDateFree({ req, date, inquiryId: inquiry.id })
    await req.payload.update({ collection: 'availability', id: current.id, data, req, context })
    return
  }

  // A day the photographer explicitly marked "available" can be taken over.
  const { docs: sameDay } = await req.payload.find({
    collection: 'availability',
    where: { date: { equals: date } },
    limit: 1,
    depth: 0,
    req,
  })
  if (sameDay[0]) {
    if (sameDay[0].status !== 'available' && idOf(sameDay[0].inquiry) !== inquiry.id) {
      throw new APIError(DATE_TAKEN_MESSAGE, 409, null, true)
    }
    await req.payload.update({ collection: 'availability', id: sameDay[0].id, data, req, context })
    return
  }
  await req.payload.create({ collection: 'availability', data, req, context })
}
