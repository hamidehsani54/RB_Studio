import type { CollectionConfig } from 'payload'
import { withSeo } from '../fields/seo'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { previewUrl } from '../lib/preview'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  orderable: true,
  admin: {
    group: 'Business',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startingPrice', 'updatedAt'],
    description: 'Each service gets a card on the website and its own dedicated page. Drag to reorder.',
    preview: (doc) => previewUrl(`/services/${doc?.slug ?? ''}`),
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: withSeo([
    { name: 'title', type: 'text', required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short description',
      admin: { description: 'Shown on the service card.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'startingPrice', type: 'text', admin: { width: '50%', description: 'e.g. "From 24 000 SEK"' } },
        { name: 'priceNote', type: 'text', admin: { width: '50%', description: 'e.g. "incl. VAT"' } },
      ],
    },
    { name: 'description', type: 'richText', label: 'Full description (service page)' },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'What’s included' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'Sample photographs' },
    {
      name: 'relatedCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: { description: 'Show recent projects from this portfolio category on the service page.' },
    },
    {
      name: 'areas',
      label: 'Service locations (local SEO)',
      type: 'array',
      admin: { description: 'Cities/regions where you offer this service, e.g. Stockholm, Uppsala, Gotland.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', defaultValue: 'Check availability', admin: { width: '50%' } },
        {
          name: 'ctaUrl',
          type: 'text',
          admin: { width: '50%', description: 'Leave empty to link to the contact form.' },
        },
      ],
    },
    slugField(),
  ]),
}
