import type { Field } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const seoFields: Field[] = [
  OverviewField({ titlePath: 'meta.title', descriptionPath: 'meta.description', imagePath: 'meta.image' }),
  MetaTitleField({ hasGenerateFn: true }),
  MetaDescriptionField({ hasGenerateFn: true }),
  MetaImageField({ relationTo: 'media', hasGenerateFn: true }),
  PreviewField({ hasGenerateFn: true, titlePath: 'meta.title', descriptionPath: 'meta.description' }),
  {
    type: 'collapsible',
    label: 'Advanced (social sharing & canonical)',
    admin: { initCollapsed: true },
    fields: [
      { name: 'ogTitle', type: 'text', label: 'Open Graph title', admin: { description: 'Defaults to the meta title.' } },
      {
        name: 'ogDescription',
        type: 'textarea',
        label: 'Open Graph description',
        admin: { description: 'Defaults to the meta description.' },
      },
      {
        name: 'canonical',
        type: 'text',
        label: 'Canonical URL',
        admin: { description: 'Only if this content lives primarily at another address. Leave empty normally.' },
      },
      { name: 'noIndex', type: 'checkbox', label: 'Hide from search engines (noindex)' },
    ],
  },
]

/**
 * Wraps a collection's fields in "Content" and "SEO" tabs.
 * Fields positioned in the sidebar stay in the sidebar.
 */
export const withSeo = (fields: Field[]): Field[] => {
  const isSidebar = (f: Field) => 'admin' in f && (f.admin as { position?: string } | undefined)?.position === 'sidebar'
  return [
    {
      type: 'tabs',
      tabs: [
        { label: 'Content', fields: fields.filter((f) => !isSidebar(f)) },
        { label: 'SEO', name: 'meta', fields: seoFields },
      ],
    },
    ...fields.filter(isSidebar),
  ]
}
