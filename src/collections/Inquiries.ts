import type { CollectionConfig, Where } from 'payload'
import { loggedIn } from '../access'

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

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'eventDate', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'location', 'message'],
    description: 'Messages sent from the contact form. Use filters and search, change the status as you go.',
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
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        try {
          const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
          const to = settings.inquiryEmail || settings.email
          if (to) {
            const rows = [
              ['Name', doc.name],
              ['Email', doc.email],
              ['Phone', doc.phone],
              ['Service', doc.service],
              ['Package', doc.package],
              ['Date', doc.eventDate ? new Date(doc.eventDate).toLocaleDateString('en-GB') : ''],
              ['Location', doc.location],
              ['Budget', doc.budget],
              ['Hours', doc.hours],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#777">${k}</td><td>${v}</td></tr>`)
              .join('')
            await req.payload.sendEmail({
              to,
              replyTo: doc.email,
              subject: `New inquiry — ${doc.name}${doc.service ? ` (${doc.service})` : ''}`,
              html: `<h2 style="font-family:Georgia,serif;font-weight:400">New inquiry from ${doc.name}</h2><table>${rows}</table><p style="white-space:pre-line">${doc.message ?? ''}</p><p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/inquiries/${doc.id}">Open in admin</a></p>`,
            })
          }
          if (settings.autoReplyEnabled && settings.autoReplyText && doc.email) {
            await req.payload.sendEmail({
              to: doc.email,
              subject: settings.autoReplySubject || `Thank you — ${settings.siteName}`,
              text: settings.autoReplyText.replace('{name}', doc.name),
            })
          }
        } catch (err) {
          req.payload.logger.error({ err, msg: 'Could not send inquiry notification' })
        }
        return doc
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
          admin: { width: '33%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
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
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Follow-up', value: 'follow-up' },
        { label: 'Booked', value: 'booked' },
        { label: 'Declined', value: 'declined' },
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
