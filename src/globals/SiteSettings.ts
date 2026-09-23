import type { GlobalConfig } from 'payload'
import { adminsOnlyField, anyone, loggedIn } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

const navItem = [
  {
    type: 'row' as const,
    fields: [
      { name: 'label', type: 'text' as const, required: true, admin: { width: '50%' } },
      { name: 'url', type: 'text' as const, required: true, admin: { width: '50%', description: 'e.g. /portfolio' } },
    ],
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'RB Studio' },
            { name: 'tagline', type: 'text', admin: { description: 'e.g. "Wedding & portrait photographer"' } },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'Square image, at least 512×512' },
                },
              ],
            },
            {
              name: 'copyright',
              type: 'text',
              admin: { description: 'Use {year} for the current year, e.g. "© {year} RB Studio"' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                { name: 'phone', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'inquiryEmail',
              type: 'email',
              admin: { description: 'Where new inquiry notifications are sent (defaults to the email above).' },
            },
            {
              type: 'collapsible',
              label: 'Automatic reply to clients',
              admin: { initCollapsed: true },
              fields: [
                { name: 'autoReplyEnabled', type: 'checkbox', defaultValue: false },
                { name: 'autoReplySubject', type: 'text' },
                { name: 'autoReplyText', type: 'textarea', admin: { description: 'Use {name} for the client name.' } },
              ],
            },
            {
              type: 'collapsible',
              label: 'Contact form',
              fields: [
                {
                  name: 'formIntro',
                  type: 'textarea',
                  admin: { description: 'Short text shown above the form.' },
                },
                {
                  name: 'budgetOptions',
                  type: 'array',
                  labels: { singular: 'Option', plural: 'Budget options' },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'hoursOptions',
                  type: 'array',
                  labels: { singular: 'Option', plural: 'Hours options' },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'consentText',
                  type: 'text',
                  defaultValue: 'I agree that RB Studio stores my details to answer my inquiry.',
                },
                { name: 'successHeading', type: 'text', defaultValue: 'Thank you.' },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  defaultValue: 'Your message has arrived. I personally reply to every inquiry within two working days.',
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            { name: 'headerLinks', type: 'array', labels: { singular: 'Link', plural: 'Header menu' }, fields: navItem },
            {
              type: 'row',
              fields: [
                { name: 'headerCtaLabel', type: 'text', defaultValue: 'Check availability', admin: { width: '50%' } },
                { name: 'headerCtaUrl', type: 'text', defaultValue: '/contact', admin: { width: '50%' } },
              ],
            },
            { name: 'footerHeading', type: 'text', defaultValue: 'Let’s create something timeless.' },
            { name: 'footerText', type: 'textarea' },
            { name: 'footerLinks', type: 'array', labels: { singular: 'Link', plural: 'Footer menu' }, fields: navItem },
            { name: 'legalLinks', type: 'array', labels: { singular: 'Link', plural: 'Legal links' }, fields: navItem },
            {
              type: 'collapsible',
              label: 'Website credit',
              admin: { initCollapsed: true, description: 'Small “Website by …” line at the bottom of the footer.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'showDeveloperCredit', type: 'checkbox', label: 'Show credit', defaultValue: true, admin: { width: '20%' } },
                    { name: 'developerName', type: 'text', defaultValue: 'Hamid Ehsani', admin: { width: '40%' } },
                    {
                      name: 'developerUrl',
                      type: 'text',
                      admin: { width: '40%', description: 'Optional link, e.g. a portfolio or LinkedIn' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social media',
          fields: [
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Social profiles' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '40%' },
                      options: ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Pinterest', 'LinkedIn', 'Vimeo', 'Other'].map(
                        (p) => ({ label: p, value: p.toLowerCase() }),
                      ),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            { name: 'instagramHandle', type: 'text', admin: { description: 'e.g. @rbstudio' } },
            {
              name: 'instagramToken',
              type: 'text',
              label: 'Instagram access token (optional)',
              access: { read: adminsOnlyField },
              admin: {
                description:
                  'For a live feed: a long-lived token from the Instagram API with Instagram Login (professional account). Leave empty to use hand-picked images.',
              },
            },
          ],
        },
        {
          label: 'SEO & local',
          fields: [
            { name: 'seoTitle', type: 'text', label: 'Default SEO title' },
            {
              name: 'seoTitleSuffix',
              type: 'text',
              defaultValue: ' — RB Studio',
              admin: { description: 'Added after every page title.' },
            },
            { name: 'seoDescription', type: 'textarea', label: 'Default meta description' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social sharing image' },
            {
              type: 'collapsible',
              label: 'Business & location (Google / structured data)',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'photographerName', type: 'text', admin: { width: '50%' } },
                    { name: 'priceRange', type: 'text', defaultValue: '$$$', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'street', type: 'text', admin: { width: '50%' } },
                    { name: 'postalCode', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', defaultValue: 'Stockholm', admin: { width: '33%' } },
                    { name: 'region', type: 'text', admin: { width: '33%' } },
                    { name: 'country', type: 'text', defaultValue: 'SE', admin: { width: '33%', description: 'Country code, e.g. SE' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'latitude', type: 'number', admin: { width: '50%' } },
                    { name: 'longitude', type: 'number', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'serviceAreas',
                  type: 'array',
                  labels: { singular: 'Area', plural: 'Service areas' },
                  fields: [{ name: 'name', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Cookies & analytics',
          fields: [
            { name: 'cookieBannerEnabled', type: 'checkbox', defaultValue: true, label: 'Show cookie consent banner' },
            {
              name: 'cookieText',
              type: 'textarea',
              defaultValue:
                'I use cookies to understand how the site is used and to improve it. You choose what to allow.',
            },
            { name: 'cookiePolicyUrl', type: 'text', defaultValue: '/cookie-policy' },
            {
              type: 'row',
              fields: [
                {
                  name: 'ga4Id',
                  label: 'Google Analytics 4 ID',
                  type: 'text',
                  admin: { width: '33%', description: 'G-XXXXXXX (loads only after consent)' },
                },
                { name: 'gtmId', label: 'Google Tag Manager ID', type: 'text', admin: { width: '33%' } },
                {
                  name: 'metaPixelId',
                  label: 'Meta Pixel ID',
                  type: 'text',
                  admin: { width: '33%', description: 'Marketing — loads only after consent' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
