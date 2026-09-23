import type { CollectionConfig } from 'payload'
import { anyone, loggedIn, loggedInField } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const statusLabel: Record<string, string> = { booked: 'Booked', tentative: 'Tentative', available: 'Available' }

export const Availability: CollectionConfig = {
  slug: 'availability',
  labels: { singular: 'Date', plural: 'Availability (list)' },
  admin: {
    group: 'Business',
    useAsTitle: 'title',
    defaultColumns: ['date', 'status', 'label', 'note'],
    listSearchableFields: ['label', 'note'],
    description:
      'Tip: the visual “Availability calendar” in the sidebar is the easiest way to manage dates. Removing a day that belongs to a booking (or setting it to Available) cancels that booking.',
  },
  defaultSort: 'date',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: {
    afterChange: [
      revalidateAfterChange,
      // Freeing a booked day in the calendar cancels the booking it belongs to.
      async ({ doc, req, context }) => {
        if (context.skipReservationSync || !doc.inquiry || doc.status !== 'available') return doc
        const inquiryId = typeof doc.inquiry === 'object' ? doc.inquiry.id : doc.inquiry
        await req.payload.update({
          collection: 'inquiries',
          id: inquiryId,
          data: { status: 'cancelled' },
          req,
          context: { skipReservationSync: true },
        })
        await req.payload.update({ collection: 'availability', id: doc.id, data: { inquiry: null }, req, context: { skipReservationSync: true } })
        return doc
      },
    ],
    afterDelete: [
      revalidateAfterDelete,
      // Removing a booked day in the calendar cancels the booking it belongs to.
      async ({ doc, req, context }) => {
        if (context.skipReservationSync || !doc.inquiry) return doc
        const inquiryId = typeof doc.inquiry === 'object' ? doc.inquiry.id : doc.inquiry
        try {
          await req.payload.update({
            collection: 'inquiries',
            id: inquiryId,
            data: { status: 'cancelled' },
            req,
            context: { skipReservationSync: true },
          })
        } catch {
          /* booking already deleted */
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        const status = data.status ?? originalDoc?.status
        if (data.date) {
          // Store every date at 12:00 UTC of its calendar day so it never shifts across time zones.
          const localDay = new Date(data.date).toLocaleDateString('en-CA', { timeZone: 'Europe/Stockholm' })
          data.date = `${localDay}T12:00:00.000Z`
        }
        const date = data.date ?? originalDoc?.date
        if (date) {
          const day = new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          })
          data.title = `${day} — ${statusLabel[status] ?? ''}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'booked',
      options: [
        { label: 'Booked', value: 'booked' },
        { label: 'Tentative (on hold)', value: 'tentative' },
        { label: 'Available', value: 'available' },
      ],
    },
    {
      name: 'label',
      type: 'text',
      label: 'Public label',
      admin: { description: 'Optional, shown publicly (e.g. "Gotland").' },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Private note',
      access: { read: loggedInField },
      admin: { description: 'Only visible in the admin panel — never on the website.' },
    },
    {
      name: 'inquiry',
      label: 'Booking',
      type: 'relationship',
      relationTo: 'inquiries',
      access: { read: loggedInField },
      admin: { readOnly: true, description: 'Set automatically when a client requests this day.' },
    },
    { name: 'title', type: 'text', admin: { hidden: true } },
  ],
}
