import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// `file:./x.db` → SQLite (local development) · `postgres://…` → PostgreSQL / Supabase (production)
const databaseUrl = process.env.DATABASE_URL || 'file:./rb-studio.db'
const isPostgres = /^postgres(ql)?:\/\//.test(databaseUrl)

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
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          max: Number(process.env.DATABASE_POOL_MAX || 10),
          // Supabase requires SSL. Provide its CA certificate (Project settings → Database → SSL)
          // in DATABASE_CA_CERT for full verification.
          ssl: /localhost|127\.0\.0\.1/.test(databaseUrl)
            ? undefined
            : process.env.DATABASE_CA_CERT
              ? { ca: process.env.DATABASE_CA_CERT.replace(/\\n/g, '\n') }
              : { rejectUnauthorized: false },
        },
        // Production schema changes only happen through reviewed migrations in src/migrations.
        // Own schema: Supabase only exposes `public` through its auto-generated REST API,
        // so Payload's tables (users, inquiries…) can't be reached with the public anon key.
        schemaName: process.env.DATABASE_SCHEMA || 'payload',
        push: false,
        migrationDir: path.resolve(dirname, 'migrations'),
        prodMigrations: migrations,
      })
    : sqliteAdapter({ client: { url: databaseUrl } }),
  sharp,
  email,
  cors: [serverURL],
  csrf: [serverURL],
  // Runs scheduled publishing (journal posts set to publish later).
  jobs: {
    // On Vercel there is no always-on process, so Vercel Cron calls /api/payload-jobs/run
    // with the CRON_SECRET (see vercel.json). Logged-in admins may trigger it too.
    access: {
      run: ({ req }) =>
        Boolean(req.user) ||
        (Boolean(process.env.CRON_SECRET) && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`),
    },
    autoRun: process.env.NODE_ENV === 'test' ? [] : [{ cron: '* * * * *', queue: 'default', limit: 10 }],
    shouldAutoRun: () => process.env.NEXT_PHASE !== 'phase-production-build',
  },
  plugins: [
    // Photos go to Vercel Blob when a token is present (serverless hosts have no permanent disk).
    // Browsers upload straight to Blob, so large camera files bypass Vercel's 4.5 MB request limit.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      clientUploads: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    }),
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
