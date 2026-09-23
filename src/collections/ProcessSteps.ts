import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

export const ProcessSteps: CollectionConfig = {
  slug: 'process-steps',
  labels: { singular: 'Process step', plural: 'Process steps' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    description: 'The steps of working with you. Numbers (01, 02…) follow the order — drag to reorder.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
  ],
}
