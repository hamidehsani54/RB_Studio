import type { CollectionConfig } from 'payload'
import { withSeo } from '../fields/seo'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { previewUrl } from '../lib/preview'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project / Story', plural: 'Projects & Stories' },
  orderable: true,
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'location', 'featured', '_status'],
    description:
      'Every wedding, portrait session or commission. Each project is shown as an immersive photo story. Drag to reorder.',
    preview: (doc) => previewUrl(`/stories/${doc?.slug ?? ''}`),
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 25 },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: withSeo([
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Anna & Erik"' } },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '50%', description: 'e.g. Stockholm' } },
        {
          name: 'date',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short introduction',
      admin: { description: 'One or two sentences used on cards and at the start of the story.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true, label: 'Cover image' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Photographs',
      admin: {
        description:
          'Select or bulk-upload photographs and drag to reorder. The editorial layout is composed automatically from each image’s shape. Captions & alt text come from the media library.',
      },
    },
    {
      name: 'chapters',
      label: 'Story text',
      type: 'array',
      labels: { singular: 'Text passage', plural: 'Text passages' },
      admin: { description: 'Short storytelling passages placed between the photographs.', initCollapsed: true },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'afterImage',
          type: 'number',
          min: 0,
          defaultValue: 2,
          admin: { description: 'Place this passage after photograph number… (0 = before the first photograph)' },
        },
      ],
    },
    {
      name: 'credits',
      type: 'array',
      admin: { description: 'Optional credits, e.g. Venue, Planner, Florist.', initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    slugField(),
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: { position: 'sidebar', description: 'Show in the featured portfolio on the homepage.' },
    },
  ]),
}
