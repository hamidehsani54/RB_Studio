import type { CollectionConfig } from 'payload'
import { withSeo } from '../fields/seo'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Portfolio category', plural: 'Portfolio categories' },
  orderable: true,
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'e.g. Weddings, Portraits, Couples. Each category gets its own portfolio page. Drag to reorder.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: withSeo([
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small line above the heading, e.g. "Wedding photography · Stockholm"' },
    },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
  ]),
}
