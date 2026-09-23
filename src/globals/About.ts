import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About the photographer',
  admin: {
    group: 'Content',
    description: 'Your personal profile — used on the About page, the homepage introduction and for Google.',
  },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'role', type: 'text', admin: { width: '50%', description: 'e.g. "Photographer & founder"' } },
              ],
            },
            { name: 'location', type: 'text', admin: { description: 'e.g. "Based in Stockholm, available worldwide"' } },
            {
              type: 'row',
              fields: [
                { name: 'portrait', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                { name: 'secondaryImage', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
              ],
            },
            { name: 'headline', type: 'text', admin: { description: 'Large heading on the About page' } },
            { name: 'bio', type: 'richText', label: 'Biography' },
          ],
        },
        {
          label: 'Style & philosophy',
          fields: [
            { name: 'philosophy', type: 'textarea' },
            { name: 'style', type: 'textarea', label: 'Photography style' },
            {
              name: 'experience',
              type: 'array',
              labels: { singular: 'Figure', plural: 'Experience in numbers' },
              admin: { description: 'e.g. "12" / "years behind the camera"' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
            {
              name: 'facts',
              type: 'array',
              labels: { singular: 'Fact', plural: 'Personal details' },
              admin: { description: 'Small personal details, e.g. "Coffee" / "Oat flat white"' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Publications & awards',
          fields: [
            {
              name: 'publications',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'year', type: 'text', admin: { width: '20%' } },
                    { name: 'url', type: 'text', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'awards',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'issuer', type: 'text', admin: { width: '40%' } },
                    { name: 'year', type: 'text', admin: { width: '20%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
