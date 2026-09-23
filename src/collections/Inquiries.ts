import type { CollectionConfig, PayloadRequest, Where } from 'payload'
import { loggedIn } from '../access'
import { assertDateFree, formatLongDate, normaliseDate, reservationFor, syncReservation } from '../lib/booking'
import { DEFAULT_EMAILS, fillTemplate, renderEmail } from '../lib/emailTemplate'
import type { Inquiry, SiteSetting } from '../payload-types'

export const csvCell = (value: unknown) => {
  const str = value === null || value === undefined ? '' : String(value)
  return /[",\n;]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

const exportColumns = [
  'createdAt',
  'status',
  'name',
  'email',
  'phone',
  'service',
  'package',
  'eventDate',
  'location',
  'budget',
  'hours',
  'message',
] as const

const siteUrl = () =>
  (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, '')


const bookingDetails = (doc: Inquiry): [string, string | null | undefined][] => [
  ['Date', formatLongDate(doc.eventDate)],
  ['Service', doc.service],
  ['Package', doc.package],
  ['Location', doc.location],
]

/** Sends email but never lets a mail-server problem break saving the booking. */
async function safeSend(req: PayloadRequest, message: Parameters<PayloadRequest['payload']['sendEmail']>[0], label: string) {
  try {
    await req.payload.sendEmail(message)
  } catch (err) {
    req.payload.logger.error({ err, msg: `Could not send ${label} email` })
  }
}

async function sendClientEmail(req: PayloadRequest, doc: Inquiry, settings: SiteSetting, kind: 'request' | 'confirmed') {
  if (settings.sendClientEmails === false || !doc.email) return
  const values = {
    name: doc.name,
    date: doc.eventDate ? formatLongDate(doc.eventDate) : 'your requested date',
    service: doc.service ?? '',
    package: doc.package ?? '',
    siteName: settings.siteName,
  }
  const subject =
    kind === 'request'
      ? settings.requestEmailSubject || DEFAULT_EMAILS.requestSubject
      : settings.confirmedEmailSubject || DEFAULT_EMAILS.confirmedSubject
  const message =
    kind === 'request'
      ? settings.requestEmailMessage || DEFAULT_EMAILS.requestMessage
      : settings.confirmedEmailMessage || DEFAULT_EMAILS.confirmedMessage
  const text = fillTemplate(message, values)
  await safeSend(
    req,
    {
      to: doc.email,
      replyTo: settings.inquiryEmail || settings.email || undefined,
      subject: fillTemplate(subject, values),
      text,
      html: renderEmail({
        siteName: settings.siteName,
        heading: kind === 'request' ? 'Booking request received' : 'Your booking is confirmed',
        message: text,
        details: bookingDetails(doc),
        footer: [settings.siteName, settings.email, settings.phone].filter(Boolean).join(' · '),
        logoUrl: `${siteUrl()}/brand/rb-studio-logo.png`,
      }),
    },
    kind === 'request' ? 'booking request' : 'booking confirmation',
  )
}

async function notifyStudio(req: PayloadRequest, doc: Inquiry, settings: SiteSetting) {
  const to = settings.inquiryEmail || settings.email
  if (!to) return
  await safeSend(
    req,
    {
      to,
      replyTo: doc.email,
      subject: `New booking request — ${doc.name}${doc.eventDate ? ` · ${formatLongDate(doc.eventDate)}` : ''}`,
      html: renderEmail({
        siteName: settings.siteName,
        heading: `New request from ${doc.name}`,
        message: `${doc.eventDate ? 'The date has been reserved as “tentative” in the calendar. ' : ''}Open the booking in the admin to confirm or decline it:\n${siteUrl()}/admin/collections/inquiries/${doc.id}`,
        details: [
          ['Name', doc.name],
          ['Email', doc.email],
          ['Phone', doc.phone],
          ...bookingDetails(doc),
          ['Budget', doc.budget],
          ['Hours', doc.hours],
          ['Message', doc.message],
        ],
      }),
    },
    'studio notification',
  )
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Booking', plural: 'Bookings & inquiries' },
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventDate', 'service', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'location', 'message'],
    description:
      'Every request from the contact form. A request with a date reserves that day. Set the status to “Confirmed” to book it (the client receives a confirmation email), or “Cancelled”/“Declined” to free the day again.',
    components: {
      beforeListTable: ['/components/admin/ExportInquiries#ExportInquiries'],
    },
  },
  defaultSort: '-createdAt',
  // The public form submits through a server action (with spam protection),
  // so the REST API stays closed to anonymous visitors.
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        const where = (req.query?.where as Where) || undefined
        const { docs } = await req.payload.find({
          collection: 'inquiries',
          where,
          limit: 10000,
          sort: '-createdAt',
          depth: 0,
          req,
        })
        const rows = [
          exportColumns.join(','),
          ...docs.map((doc) =>
            exportColumns.map((col) => csvCell((doc as unknown as Record<string, unknown>)[col])).join(','),
          ),
        ]
        const stamp = new Date().toISOString().slice(0, 10)
        return new Response('﻿' + rows.join('\n'), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="rb-studio-inquiries-${stamp}.csv"`,
          },
        })
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Normalise the date and refuse days that already belong to another booking.
      async ({ data, originalDoc, req, context }) => {
        if (data.eventDate) data.eventDate = normaliseDate(data.eventDate)
        if (context.skipReservationSync) return data
        const status = data.status ?? originalDoc?.status ?? 'new'
        const date = data.eventDate !== undefined ? data.eventDate : originalDoc?.eventDate
        const action = reservationFor(status)
        if (date && (action === 'tentative' || action === 'booked')) {
          await assertDateFree({ req, date, inquiryId: originalDoc?.id })
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req, context }) => {
        // Keep the calendar in sync (runs in the same database transaction).
        if (!context.skipReservationSync) await syncReservation({ req, inquiry: doc })

        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
        if (operation === 'create') {
          await notifyStudio(req, doc, settings)
          await sendClientEmail(req, doc, settings, 'request')
        } else if (doc.status === 'booked' && previousDoc?.status !== 'booked') {
          await sendClientEmail(req, doc, settings, 'confirmed')
        }
        return doc
      },
    ],
    beforeDelete: [
      // Deleting a booking frees its day. This runs before the delete, because the database
      // clears the day's link to the booking as part of deleting it.
      async ({ id, req }) => {
        const { docs } = await req.payload.find({
          collection: 'availability',
          where: { inquiry: { equals: id } },
          depth: 0,
          req,
        })
        for (const d of docs) {
          await req.payload.delete({ collection: 'availability', id: d.id, req, context: { skipReservationSync: true } })
        }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '33%' } },
        { name: 'phone', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'service', type: 'text', admin: { width: '33%' } },
        { name: 'package', type: 'text', admin: { width: '33%' } },
        {
          name: 'eventDate',
          label: 'Event / wedding date',
          type: 'date',
          admin: {
            width: '33%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
            description: 'Changing the date moves the reservation in the calendar.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '33%' } },
        { name: 'budget', label: 'Estimated budget', type: 'text', admin: { width: '33%' } },
        { name: 'hours', label: 'Number of hours', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'internalNotes',
      label: 'Internal notes',
      type: 'array',
      labels: { singular: 'Note', plural: 'Internal notes' },
      admin: { description: 'Private notes — call logs, follow-ups, details.' },
      fields: [
        { name: 'note', type: 'textarea', required: true },
        {
          name: 'date',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New request (date reserved)', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Follow-up', value: 'follow-up' },
        { label: 'Confirmed ✓ (emails the client)', value: 'booked' },
        { label: 'Declined (frees the date)', value: 'declined' },
        { label: 'Cancelled (frees the date)', value: 'cancelled' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Privacy consent given',
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'sourcePage', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}
