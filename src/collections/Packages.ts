import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'

export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: 'Pricing package', plural: 'Pricing' },
  orderable: true,
  admin: {
    group: 'Business',
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'service', 'mostPopular'],
    description:
      'Create, reorder (drag) and edit your packages. The button opens the contact form with this package pre-selected.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Essential, Signature, Full day' } },
    { name: 'tagline', type: 'text', admin: { description: 'e.g. "For intimate ceremonies"' } },
    { name: 'description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'text', required: true, admin: { width: '50%', description: 'e.g. "18 500 SEK"' } },
        { name: 'priceNote', type: 'text', admin: { width: '50%', description: 'e.g. "incl. VAT · 4 hours"' } },
      ],
    },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Item', plural: 'What’s included' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', defaultValue: 'Enquire', admin: { width: '50%' } },
        {
          name: 'ctaUrl',
          type: 'text',
          admin: { width: '50%', description: 'Leave empty to open the contact form with this package selected.' },
        },
      ],
    },
    slugField('name'),
    { name: 'service', type: 'relationship', relationTo: 'services', admin: { position: 'sidebar' } },
    {
      name: 'mostPopular',
      type: 'checkbox',
      label: 'Mark as “Most popular”',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
