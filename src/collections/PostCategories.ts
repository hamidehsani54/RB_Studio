import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: 'Journal category', plural: 'Journal categories' },
  admin: { group: 'Journal', useAsTitle: 'title' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [{ name: 'title', type: 'text', required: true }, slugField()],
}
