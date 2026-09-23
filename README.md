# RB Studio — photography website & CMS

Premium editorial portfolio website for RB Studio with a built-in admin panel. Every piece of visible content (texts, images, sections, prices, services, FAQ, availability, SEO, legal pages, social links, cookie/analytics settings) is managed at **/admin**. Nothing is hardcoded.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router, React Server Components), plain CSS design system |
| CMS / API / Admin | Payload CMS 3 (runs inside the same Next.js app, REST + GraphQL at `/api`) |
| Database | SQLite in development → Postgres in production (one-line swap) |
| Media | Uploaded to `/media`, auto-compressed to WebP, responsive sizes, served as AVIF/WebP via `next/image` |
| Email | SMTP via Nodemailer (inquiry notifications, auto-reply, password reset) |

## Getting started

```bash
npm install
cp .env.example .env        # fill in PAYLOAD_SECRET and PREVIEW_SECRET
npm run seed                # creates the admin user + sample content (prints the password)
npm run dev                 # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

To start over with a clean database: stop the server, delete `rb-studio.db` and the `media/` folder, run `npm run seed`.

## What the photographer manages in /admin

- **Pages**: each page is a stack of sections (Hero, Introduction, Featured portfolio, Featured story, Services, Pricing, Process, Testimonials, FAQ, Availability, Contact form, Instagram, About, Text, Image/quote banner, Call to action, Gallery, Portfolio overview, Journal list). Sections can be added, dragged to reorder, switched on/off and given a tone (ivory / sand / dark). The page with slug `home` is the homepage. Drafts autosave, and **Preview** shows a draft on the real site.
- **Portfolio**: categories (each gets its own page) and Projects & Stories (cover, bulk-uploaded photographs in drag-and-drop order, story text placed between photos, credits, featured flag, SEO). The story layout is composed automatically from each photo's proportions.
- **Business**: Services (each gets its own page with local-SEO service areas), Pricing packages (reorder, “Most popular”, the CTA opens the form with the package pre-selected), Availability (a list view plus a visual **Availability calendar** with private notes that never reach the public site), Inquiries (CRM: statuses New → Archived, internal notes, search, filters, CSV export that respects filters).
- **Content**: Media library (folders, alt text, captions, focal point, replace file), Testimonials, FAQ (topics), Process steps, About the photographer.
- **Journal**: rich-text articles with galleries, video embeds, categories, tags, drafts and scheduled publishing.
- **Settings**: Site settings (logo, favicon, contact, navigation, footer, social, Instagram token, default SEO, business location and service areas, cookie banner, GA4 / GTM / Meta Pixel IDs), Users with roles (Administrator / Editor).

## SEO, performance, accessibility

- Per-page SEO tab: meta title/description/image with live Google preview, Open Graph overrides, canonical URL, noindex.
- Auto-generated `sitemap.xml` and `robots.txt`; structured data for LocalBusiness/ProfessionalService, Service, ImageGallery, BlogPosting, FAQPage and breadcrumbs.
- Static pages with on-demand revalidation when content is saved; AVIF/WebP responsive images, blur-up placeholders, lazy loading; self-hosted optimized fonts; minimal client JS (header, slideshow, testimonial slider, form, cookie banner).
- Semantic headings, skip link, keyboard-accessible menu with focus trap, native `<details>` accordions, labelled form fields with error messages, `prefers-reduced-motion` respected.
- Cookie banner (GDPR): analytics/marketing scripts load **only after consent**, and the banner appears only when such an integration is configured.

## Testing

```bash
npm test             # unit + integration tests (uses a throwaway test.db — your real content is never touched)
npm run test:smoke   # end-to-end checks against the running site (start `npm run dev` first)
SITE_URL=https://rbstudio.se npm run test:smoke   # …or against the live site after deploying
```

- **Unit** (`tests/unit`): slugs, URL/date helpers, video embeds, CSV escaping, the automatic story layout engine.
- **Integration** (`tests/int`): access control and roles, drafts, private availability notes, login lockout and password reset, slug and date rules, ordering, pricing packages, journal publishing, page sections, the contact form (validation, spam protection, rate limiting, email notifications, auto-reply), inquiry CRM and CSV export, image optimisation, SEO metadata and the sitemap.
- **Smoke** (`tests/e2e`): crawls every sitemap URL and checks it renders, has one `<h1>`, a title, a meta description, a canonical URL, Open Graph tags, alt text on every image and valid JSON-LD; also checks 404s, robots.txt, AVIF/WebP delivery, security headers and API permissions.

## Production deployment

1. **Database**: `npm i @payloadcms/db-postgres`, then in `src/payload.config.ts` replace `sqliteAdapter(...)` with
   `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })`. Create migrations with `npm run payload migrate:create` and run `npm run payload migrate` on deploy.
2. **Media storage**: on serverless/multi-instance hosting, add `@payloadcms/storage-s3` (S3, Cloudflare R2, DigitalOcean Spaces…) so photographs live in object storage behind a CDN. On a single VPS the local `media/` folder works (back it up).
3. Set `NEXT_PUBLIC_SERVER_URL` to the real domain, fill in SMTP settings, and set strong `PAYLOAD_SECRET` / `PREVIEW_SECRET` values.
4. `npm run build && npm start` (Node 20+), or deploy to Vercel / Railway / a VPS.

## Before launch: replace sample content

The seed content is placeholder material to show the structure:
- Photographs are free Unsplash images — replace them with RB Studio’s own work.
- Contact details (`hello@rbstudio.se`, `+46 70 000 00 00`), prices, testimonials, publications/awards, client names and the biography are samples.
- Privacy, cookie and terms pages are starting templates; have them reviewed.
- Change the admin password after first login.
