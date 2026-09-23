import type { CollectionConfig } from 'payload'
import { anyone, loggedIn, loggedInField } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

const statusLabel: Record<string, string> = { booked: 'Booked', tentative: 'Tentative', available: 'Available' }

export const Availability: CollectionConfig = {
  slug: 'availability',
  labels: { singular: 'Date', plural: 'Availability (list)' },
  admin: {
    group: 'Business',
    useAsTitle: 'title',
    defaultColumns: ['date', 'status', 'label', 'note'],
    listSearchableFields: ['label', 'note'],
    description: 'Tip: the visual “Availability calendar” in the sidebar is the easiest way to manage dates.',
  },
  defaultSort: 'date',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: {
    ...revalidateHooks,
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
    { name: 'title', type: 'text', admin: { hidden: true } },
  ],
}
