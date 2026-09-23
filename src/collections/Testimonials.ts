import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'location', 'category', 'featured'],
    description: 'Kind words from clients. Drag to reorder.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'clientName', type: 'text', required: true, admin: { description: 'e.g. "Anna & Erik"' } },
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '50%' } },
        {
          name: 'date',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
        },
      ],
    },
    { name: 'clientImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
  ],
}
