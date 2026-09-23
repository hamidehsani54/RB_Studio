import type { CollectionConfig } from 'payload'
import { withSeo } from '../fields/seo'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { previewUrl } from '../lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Journal article', plural: 'Journal (blog)' },
  admin: {
    group: 'Journal',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    description: 'Write articles, save drafts, publish now or schedule for later.',
    preview: (doc) => previewUrl(`/journal/${doc?.slug ?? ''}`),
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: {
    ...revalidateHooks,
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: withSeo([
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary for the journal list and Google.' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Cover image' },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter((f) => f.key !== 'heading'),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          BlocksFeature({
            blocks: [
              {
                slug: 'gallery',
                labels: { singular: 'Gallery', plural: 'Galleries' },
                fields: [
                  { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
                  {
                    name: 'columns',
                    type: 'select',
                    defaultValue: '2',
                    options: [
                      { label: '1 column (large)', value: '1' },
                      { label: '2 columns', value: '2' },
                      { label: '3 columns', value: '3' },
                    ],
                  },
                ],
              },
              {
                slug: 'video',
                labels: { singular: 'Video embed', plural: 'Video embeds' },
                fields: [
                  {
                    name: 'url',
                    type: 'text',
                    required: true,
                    admin: { description: 'YouTube or Vimeo link' },
                  },
                  { name: 'caption', type: 'text' },
                ],
              },
            ],
          }),
        ],
      }),
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'post-categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
  ]),
}
