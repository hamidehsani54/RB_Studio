import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Packages } from './collections/Packages'
import { Testimonials } from './collections/Testimonials'
import { Faqs } from './collections/Faqs'
import { ProcessSteps } from './collections/ProcessSteps'
import { Availability } from './collections/Availability'
import { Inquiries } from './collections/Inquiries'
import { Posts } from './collections/Posts'
import { PostCategories } from './collections/PostCategories'
import { SiteSettings } from './globals/SiteSettings'
import { About } from './globals/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'hello@rbstudio.se',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'RB Studio',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — RB Studio admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/rb-studio-logo.png' }],
      robots: 'noindex, nofollow',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Graphics#Logo',
        Icon: '/components/admin/Graphics#Icon',
      },
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
      beforeNavLinks: ['/components/admin/NavLinks#NavLinks'],
      views: {
        availabilityCalendar: {
          Component: '/components/admin/AvailabilityCalendarView#AvailabilityCalendarView',
          path: '/availability-calendar',
          meta: { title: 'Availability calendar' },
        },
      },
    },
  },
  collections: [
    Pages,
    Media,
    Testimonials,
    Faqs,
    ProcessSteps,
    Projects,
    Categories,
    Services,
    Packages,
    Availability,
    Inquiries,
    Posts,
    PostCategories,
    Users,
  ],
  globals: [SiteSettings, About],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./rb-studio.db' },
  }),
  sharp,
  email,
  cors: [serverURL],
  csrf: [serverURL],
  // Runs scheduled publishing (journal posts set to publish later).
  jobs: {
    autoRun: process.env.NODE_ENV === 'test' ? [] : [{ cron: '* * * * *', queue: 'default', limit: 10 }],
    shouldAutoRun: () => process.env.NEXT_PHASE !== 'phase-production-build',
  },
  plugins: [
    seoPlugin({
      // SEO fields are placed manually (see fields/seo.ts) — the plugin supplies the "generate" buttons.
      collections: [],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title}` : 'RB Studio'),
      generateDescription: ({ doc }) => doc?.excerpt || doc?.description || '',
      generateImage: ({ doc }) => doc?.cover || doc?.image || undefined,
      generateURL: ({ doc, collectionSlug }) => {
        const prefix: Record<string, string> = {
          projects: '/stories/',
          services: '/services/',
          posts: '/journal/',
          categories: '/portfolio/',
          pages: '/',
        }
        return `${serverURL}${prefix[collectionSlug ?? 'pages'] ?? '/'}${doc?.slug === 'home' ? '' : (doc?.slug ?? '')}`
      },
    }),
  ],
})
