import type { Field, GroupField } from 'payload'

export const slugify = (value: string) =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[åä]/gi, 'a')
    .replace(/ö/gi, 'o')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/_/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** URL slug, generated from another field unless typed manually. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  label: 'URL slug',
  admin: {
    position: 'sidebar',
    description: 'The address of this page. Leave empty to generate it from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        const source = value || data?.[from] || originalDoc?.[from]
        return typeof source === 'string' && source ? slugify(source) : value
      },
    ],
  },
})

/** A simple button/link: a label and where it goes. */
export const linkGroup = (name: string, label: string, defaults?: { label?: string; url?: string }): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'Button text', defaultValue: defaults?.label, admin: { width: '50%' } },
        {
          name: 'url',
          type: 'text',
          label: 'Link',
          defaultValue: defaults?.url,
          admin: { width: '50%', description: 'e.g. /contact, /portfolio or https://…' },
        },
      ],
    },
  ],
})

export const sortOrderNote = 'Drag rows in the list view to change the order on the website.'
