import type { CollectionConfig } from 'payload'
import { withSeo } from '../fields/seo'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { pageBlocks } from '../blocks/config'
import { previewUrl } from '../lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description:
      'Every page is built from sections. Add, remove, reorder (drag) and switch sections on/off. The page with slug “home” is the homepage.',
    preview: (doc) => previewUrl(doc?.slug === 'home' ? '/' : `/${doc?.slug ?? ''}`),
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 30 },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: withSeo([
    { name: 'title', type: 'text', required: true },
    {
      name: 'layout',
      label: 'Sections',
      type: 'blocks',
      blocks: pageBlocks,
      admin: { initCollapsed: true },
    },
    slugField(),
    {
      name: 'excludeFromSitemap',
      type: 'checkbox',
      label: 'Exclude from sitemap',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ]),
}
