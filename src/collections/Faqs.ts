import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'topic', 'updatedAt'],
    description: 'Drag to reorder. Use topics to group questions.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'topic',
      type: 'text',
      admin: { position: 'sidebar', description: 'Category, e.g. "Booking", "Weddings", "Delivery".' },
    },
  ],
}
