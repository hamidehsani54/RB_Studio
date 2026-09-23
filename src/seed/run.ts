/**
 * Seeds a fresh RB Studio database with structure and sample content.
 * Run:  npm run seed
 * Everything created here is ordinary CMS content — edit or delete it in the admin panel.
 * The sample photographs are free Unsplash images, meant to be replaced with RB Studio's own work.
 */
import crypto from 'crypto'
import { getPayload, type CollectionSlug } from 'payload'
import config from '../payload.config'
import { block, doc, h, p, paragraphs, quote, ul, upload } from './richtext'

const payload = await getPayload({ config })
const context = { disableRevalidate: true }

const existing = await payload.count({ collection: 'pages' })
if (existing.totalDocs > 0) {
  payload.logger.warn('The database already contains pages — seeding skipped so nothing is overwritten.')
  payload.logger.warn('To start over, stop the server, delete rb-studio.db and the /media folder, then run npm run seed again.')
  process.exit(0)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = async (collection: CollectionSlug, data: Record<string, any>) =>
  payload.create({ collection, data: data as never, context, draft: false })

/* ------------------------------------------------------------------ */
/* Admin user                                                          */
/* ------------------------------------------------------------------ */

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@rbstudio.se'
const adminPassword = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
await create('users', { name: 'RB Studio', email: adminEmail, password: adminPassword, role: 'admin' })

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

const photos: Record<string, [string, string]> = {
  bouquetGlow: ['1519741497674-611481863552', 'Bride holding a bouquet of white roses in warm evening backlight'],
  balloons: ['1511285560929-80b456fea0bc', 'Newlyweds watching balloons rise above a lakeside reception'],
  handsRings: ['1465495976277-4387d4b0b4c6', 'Close-up of the couple’s hands with wedding rings and a peach rose bouquet'],
  rings: ['1606800052052-a08af7148866', 'Two gold wedding rings resting on linen'],
  confetti: ['1583939003579-730e3918a45a', 'Bride and groom kissing as guests throw confetti after the ceremony'],
  chairs: ['1522673607200-164d1b6ce486', 'Two decorated chairs for the couple on a green lawn'],
  seaVeil: ['1537633552985-df8429e8048b', 'Bride and groom embracing on a pebble beach, her long veil in the wind'],
  goldenCouple: ['1591604466107-ec97de577aff', 'Couple smiling together in golden autumn light'],
  shadows: ['1520854221256-17451cc331bf', 'Bride and groom holding hands, their shadows on the grass'],
  shoes: ['1509927083803-4bd519298ac4', 'The bride’s shoes beside the groom’s brown brogues'],
  bouquetSky: ['1529636798458-92182e662485', 'Bride raising her bouquet against a pale sky'],
  hills: ['1532712938310-34cb3982ef74', 'Couple walking hand in hand through the hills at dusk'],
  aisle: ['1469371670807-013ccf25f16a', 'Flower-lined aisle leading to an outdoor ceremony arch'],
  bouquetPeach: ['1525258946800-98cfd641d0de', 'Bridal bouquet of peach and white roses'],
  sign: ['1507504031003-b417219a0fde', 'Wooden “Mr & Mrs” sign among spring leaves'],
  laughing: ['1494790108377-be9c29b29330', 'Portrait of a laughing woman in a red sweater'],
  auburn: ['1438761681033-6461ffad8d80', 'Portrait of a young woman with auburn hair by a lake'],
  man: ['1500648767791-00dcc994a43e', 'Portrait of a smiling man in a grey sweater'],
  stripes: ['1544005313-94ddf0286df2', 'Portrait of a woman in a striped shirt in soft evening light'],
  pink: ['1531746020798-e6953c6e8e04', 'Studio portrait of a woman against a dusty pink backdrop'],
  sunsetGroup: ['1511895426328-dc8714191300', 'Family and friends standing together on the shore at sunset'],
  familyBeach: ['1475503572774-15a45e5d60b9', 'A family of three walking into the waves together'],
  heart: ['1516589178581-6cd7833ae3b2', 'Two hands forming a heart against the setting sun'],
  cameraSun: ['1554048612-b6a482bc67e5', 'Photographer holding a camera up against the sun'],
  mountain: ['1492691527719-9d1e07e534b4', 'Photographer working from a mountain top above the clouds'],
  hall: ['1511578314322-379afb476865', 'Conference hall set up for a corporate event'],
  audience: ['1540575467063-178a50c2df87', 'Audience listening to a talk in a dark auditorium'],
  teal: ['1509631179647-0177331693ae', 'Editorial fashion portrait against a teal wall'],
  yellow: ['1515886657613-9f3515b0c78f', 'Fashion editorial of a model in a yellow tracksuit'],
  valley: ['1470071459604-3b5ec3a7fe05', 'Green valley with low clouds drifting over the cliffs'],
  pavilion: ['1523438885200-e635ba2c371e', 'Garden ceremony pavilion decorated with flowers'],
  bwKiss: ['1460978812857-470ed1c77af0', 'Black and white photograph of the bride and groom kissing beneath her veil'],
  road: ['1478146896981-b80fe463b330', 'Woman in a floral dress standing on a mountain road'],
  table: ['1519225421980-715cb0215aed', 'Long reception table with wildflowers and candles'],
}

const media: Record<keyof typeof photos, number> = {} as never
for (const [key, [id, alt]] of Object.entries(photos)) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2400&q=82&fm=jpg`)
  if (!res.ok) {
    payload.logger.warn(`Could not download ${key} (${res.status}) — skipped`)
    continue
  }
  const data = Buffer.from(await res.arrayBuffer())
  const doc = await payload.create({
    collection: 'media',
    data: { alt, title: alt.split(' ').slice(0, 5).join(' ') },
    file: { data, mimetype: 'image/jpeg', name: `rb-${key}.jpg`, size: data.length },
    context,
  })
  media[key as keyof typeof photos] = doc.id
  payload.logger.info(`Uploaded ${key}`)
}
const m = (...keys: (keyof typeof photos)[]) => keys.map((k) => media[k]).filter(Boolean)

/* ------------------------------------------------------------------ */
/* Portfolio                                                           */
/* ------------------------------------------------------------------ */

const categoryData = [
  { title: 'Weddings', eyebrow: 'Wedding photography · Stockholm & beyond', cover: 'seaVeil', description: 'Honest, elegant coverage of the whole day — from quiet morning moments to the last dance.' },
  { title: 'Couples', eyebrow: 'Engagement & couple sessions', cover: 'hills', description: 'Unhurried sessions in places that mean something to you.' },
  { title: 'Portraits', eyebrow: 'Personal & professional portraits', cover: 'auburn', description: 'Calm, natural portraits with real character — for you, your brand or your family archive.' },
  { title: 'Families', eyebrow: 'Family photography', cover: 'familyBeach', description: 'Relaxed family sessions, outdoors or at home, made to be printed and passed down.' },
  { title: 'Events', eyebrow: 'Events & conferences', cover: 'audience', description: 'Discreet documentation of conferences, launches and celebrations.' },
  { title: 'Commercial & Editorial', eyebrow: 'Brands, fashion & editorial', cover: 'teal', description: 'Image-led stories for brands, magazines and creative studios.' },
] as const

const categories: Record<string, number> = {}
for (const c of categoryData) {
  const d = await create('categories', { ...c, cover: media[c.cover] })
  categories[c.title] = d.id as number
}

const projectData = [
  {
    title: 'Anna & Erik',
    location: 'Stockholm',
    date: '2026-06-13',
    category: 'Weddings',
    featured: true,
    cover: 'confetti',
    gallery: m('confetti', 'handsRings', 'shoes', 'aisle', 'bouquetPeach', 'bwKiss', 'table', 'balloons', 'bouquetSky', 'shadows'),
    excerpt:
      'A midsummer wedding by the water — linen, wildflowers and a hundred friends who danced until the light came back.',
    chapters: [
      { heading: 'The morning', text: 'Anna got ready at her grandmother’s summer house. Quiet coffee, open windows, and a dress that had waited a year for this day.', afterImage: 3 },
      { heading: 'The vows', text: 'They wrote their own. Erik got through two lines before he had to stop and laugh — and so did everyone else.', afterImage: 6 },
      { text: 'Dinner stretched on long tables under the birches, and when the balloons went up, nobody wanted the evening to end.', afterImage: 8 },
    ],
    credits: [
      { role: 'Venue', name: 'A private estate, Stockholm archipelago' },
      { role: 'Flowers', name: 'Local florist' },
    ],
  },
  {
    title: 'Sofia & Jonas',
    location: 'Gotland',
    date: '2025-08-23',
    category: 'Weddings',
    featured: true,
    cover: 'seaVeil',
    gallery: m('seaVeil', 'sign', 'rings', 'pavilion', 'chairs', 'bouquetGlow', 'heart'),
    excerpt: 'Salt wind, limestone and a veil that refused to sit still. An intimate island wedding for thirty guests.',
    chapters: [
      { text: 'We walked down to the shore between the ceremony and dinner. Twenty minutes, just the three of us and the sea.', afterImage: 1 },
    ],
  },
  {
    title: 'Elin & Marcus',
    location: 'Dalarna',
    date: '2025-10-04',
    category: 'Couples',
    featured: true,
    cover: 'hills',
    gallery: m('hills', 'goldenCouple', 'shadows', 'heart', 'road'),
    excerpt: 'An autumn engagement session in the hills where they first met.',
  },
  {
    title: 'Ingrid',
    location: 'Stockholm',
    date: '2026-03-18',
    category: 'Portraits',
    featured: true,
    cover: 'auburn',
    gallery: m('auburn', 'stripes', 'pink', 'laughing', 'man'),
    excerpt: 'A portrait series in natural light — by the water, in the studio, and somewhere in between.',
  },
  {
    title: 'The Lindqvist family',
    location: 'Halland',
    date: '2025-07-12',
    category: 'Families',
    featured: true,
    cover: 'familyBeach',
    gallery: m('familyBeach', 'sunsetGroup', 'heart'),
    excerpt: 'Three generations, one long summer evening on the west coast.',
  },
  {
    title: 'Nordic Design Forum',
    location: 'Stockholm',
    date: '2026-04-22',
    category: 'Events',
    featured: false,
    cover: 'audience',
    gallery: m('audience', 'hall'),
    excerpt: 'Two days of talks, workshops and conversations, documented for the organisers and press.',
  },
  {
    title: 'Studio Aurora — SS26',
    location: 'Stockholm',
    date: '2026-02-10',
    category: 'Commercial & Editorial',
    featured: true,
    cover: 'teal',
    gallery: m('teal', 'yellow', 'road'),
    excerpt: 'A colour-led campaign for a Scandinavian fashion label.',
  },
] as const

const projects: Record<string, number> = {}
for (const pr of projectData) {
  const d = await create('projects', {
    ...pr,
    date: `${pr.date}T12:00:00.000Z`,
    category: categories[pr.category],
    cover: media[pr.cover],
    gallery: [...pr.gallery],
    chapters: 'chapters' in pr ? [...pr.chapters] : [],
    credits: 'credits' in pr ? [...pr.credits] : [],
    _status: 'published',
  })
  projects[pr.title] = d.id as number
}

/* ------------------------------------------------------------------ */
/* Services & pricing                                                  */
/* ------------------------------------------------------------------ */

const serviceData = [
  {
    title: 'Wedding Photography',
    image: 'seaVeil',
    startingPrice: 'From 18 500 SEK',
    priceNote: 'incl. VAT',
    category: 'Weddings',
    excerpt: 'Timeless, documentary coverage of your wedding — the big moments and the quiet ones in between.',
    features: ['Personal planning meeting', 'Timeline & location advice', 'Online gallery to share', 'Print release for personal use'],
    areas: ['Stockholm', 'Uppsala', 'Gotland', 'Destination weddings'],
    gallery: m('handsRings', 'aisle', 'bwKiss', 'table'),
  },
  {
    title: 'Portrait Photography',
    image: 'stripes',
    startingPrice: 'From 3 900 SEK',
    category: 'Portraits',
    excerpt: 'Natural personal and professional portraits with calm direction and honest light.',
    features: ['1–2 hour session', 'Location or studio', '20+ edited images', 'Help with styling'],
    areas: ['Stockholm'],
    gallery: m('auburn', 'pink', 'man'),
  },
  {
    title: 'Family Photography',
    image: 'familyBeach',
    startingPrice: 'From 4 500 SEK',
    category: 'Families',
    excerpt: 'Relaxed sessions outdoors or at home — real connection, not stiff poses.',
    features: ['Up to 2 hours', 'Outdoor or at home', '40+ edited images', 'Print recommendations'],
    areas: ['Stockholm', 'Uppsala'],
    gallery: m('sunsetGroup', 'heart'),
  },
  {
    title: 'Commercial Photography',
    image: 'teal',
    startingPrice: 'From 9 500 SEK',
    priceNote: 'excl. VAT',
    category: 'Commercial & Editorial',
    excerpt: 'Campaigns, product and brand imagery with a clear visual direction.',
    features: ['Creative pre-production', 'Half or full day shoots', 'Commercial licence', 'Fast delivery'],
    areas: ['Stockholm', 'Nordics'],
    gallery: m('yellow', 'road'),
  },
  {
    title: 'Event Photography',
    image: 'audience',
    startingPrice: 'From 8 500 SEK',
    priceNote: 'excl. VAT',
    category: 'Events',
    excerpt: 'Discreet, story-driven coverage of conferences, launches and celebrations.',
    features: ['Hourly or full-day coverage', 'Same-day selects for social media', 'Full gallery within a week'],
    areas: ['Stockholm', 'Göteborg', 'Malmö'],
    gallery: m('hall'),
  },
  {
    title: 'Editorial Photography',
    image: 'road',
    startingPrice: 'From 7 500 SEK',
    priceNote: 'excl. VAT',
    category: 'Commercial & Editorial',
    excerpt: 'Portraits and stories for magazines, publications and creative teams.',
    features: ['Concept development', 'Location scouting', 'Editorial licence'],
    areas: ['Stockholm', 'Worldwide on request'],
    gallery: m('teal', 'yellow'),
  },
] as const

const services: Record<string, number> = {}
for (const s of serviceData) {
  const d = await create('services', {
    title: s.title,
    image: media[s.image],
    startingPrice: s.startingPrice,
    priceNote: 'priceNote' in s ? s.priceNote : undefined,
    excerpt: s.excerpt,
    relatedCategory: categories[s.category],
    features: s.features.map((text) => ({ text })),
    areas: s.areas.map((name) => ({ name })),
    gallery: [...s.gallery],
    ctaLabel: 'Check availability',
    description: doc(
      p(`${s.excerpt} Every session begins with a conversation, so the images fit you — not a template.`),
      h('h3', 'My approach'),
      p('I work quietly and observantly, guiding gently when it helps and stepping back when the moment speaks for itself. The result is a set of images that feels calm, honest and timeless.'),
      h('h3', 'What to expect'),
      p('After you get in touch, we talk through your plans, the light, the locations and what matters most to you. You receive a carefully edited gallery, ready to share and print.'),
    ),
  })
  services[s.title] = d.id as number
}

const packageData = [
  {
    name: 'Essential',
    tagline: 'For intimate ceremonies',
    price: '18 500 SEK',
    priceNote: 'incl. VAT · 4 hours',
    description: 'The ceremony, portraits and the first part of the celebration.',
    features: ['4 hours of coverage', 'Ceremony & couple portraits', '250+ edited images', 'Online gallery'],
  },
  {
    name: 'Signature',
    tagline: 'The complete wedding day',
    price: '29 500 SEK',
    priceNote: 'incl. VAT · 8 hours',
    description: 'From getting ready to the first dance — the whole story of your day.',
    features: ['8 hours of coverage', 'Planning meeting & timeline', '500+ edited images', 'Online gallery', 'Sneak peek within 72 hours'],
    mostPopular: true,
  },
  {
    name: 'Full Day',
    tagline: 'Every moment, morning to night',
    price: '39 500 SEK',
    priceNote: 'incl. VAT · 12 hours',
    description: 'Unhurried coverage with a second photographer for the whole day.',
    features: ['12 hours of coverage', 'Second photographer', '700+ edited images', 'Engagement session', 'Fine-art album'],
  },
]
for (const pk of packageData) {
  await create('packages', {
    ...pk,
    features: pk.features.map((text) => ({ text })),
    service: services['Wedding Photography'],
    ctaLabel: 'Enquire about this',
  })
}

/* ------------------------------------------------------------------ */
/* Testimonials, FAQ, process, availability                            */
/* ------------------------------------------------------------------ */

const testimonialData = [
  ['Anna & Erik', 'Stockholm', '2026-06-01', 'Weddings', 'We barely noticed the camera all day — and then the gallery arrived and we cried through every page. It feels exactly like our wedding felt.'],
  ['Sofia & Jonas', 'Gotland', '2025-08-01', 'Weddings', 'Calm, kind and incredibly talented. The pictures by the sea are the most beautiful photographs we own.'],
  ['Ingrid L.', 'Stockholm', '2026-03-01', 'Portraits', 'I hate being photographed. This was the first time I recognised myself in a portrait — and liked it.'],
  ['The Lindqvist family', 'Halland', '2025-07-01', 'Families', 'Three generations, two dogs and a toddler — and somehow every image is relaxed and full of life.'],
  ['Studio Aurora', 'Stockholm', '2026-02-01', 'Commercial & Editorial', 'A clear eye, a great collaborator and a campaign that exceeded our brief.'],
] as const
for (const [clientName, location, date, cat, q] of testimonialData) {
  await create('testimonials', { clientName, location, date: `${date}T12:00:00.000Z`, category: categories[cat], quote: q, featured: true })
}

const faqData = [
  ['Booking', 'How far in advance should we book?', 'Most couples book 9–15 months ahead, especially for Saturdays between May and September. Weekday and winter dates are often available at shorter notice — just ask.'],
  ['Booking', 'How do we reserve our date?', 'Once we have talked and you are happy, you receive a simple agreement and a booking fee. Your date is then reserved exclusively for you.'],
  ['Weddings', 'Do you travel?', 'Yes. I am based in Stockholm and photograph weddings all over Sweden and abroad. Travel costs are always quoted transparently in advance.'],
  ['Weddings', 'Can we customise a package?', 'Of course. The packages are a starting point — hours, a second photographer or an album can all be adjusted to fit your day.'],
  ['Weddings', 'Will you help us plan the timeline?', 'Yes. I share advice on light, portraits and timing so the day feels relaxed and the photographs have room to happen.'],
  ['Delivery', 'When will we receive our photographs?', 'You receive a small sneak peek within a few days and the full, carefully edited gallery within 4–6 weeks.'],
  ['Delivery', 'Can we print the images?', 'Yes — every gallery includes a print release for personal use, and I am happy to recommend labs or design an album.'],
  ['Portraits', 'What should I wear for a portrait session?', 'Something you feel like yourself in. Soft, solid colours and natural textures photograph beautifully. You get a short styling guide before the session.'],
] as const
for (const [topic, question, answer] of faqData) await create('faqs', { topic, question, answer })

const steps = [
  ['Get in touch', 'Send a few lines about you, your date and your plans through the inquiry form.'],
  ['Let’s talk', 'We meet over coffee or a video call to get to know each other and what matters to you.'],
  ['Plan your experience', 'Timeline, locations and light — I help you shape a day that feels relaxed and true to you.'],
  ['Photography day', 'I document quietly and attentively, guiding gently when it helps.'],
  ['Your images', 'A sneak peek within days, then your full, carefully edited gallery — ready to share and print.'],
]
for (const [title, text] of steps) await create('process-steps', { title, text })

const dates: [string, 'booked' | 'tentative', string?, string?][] = [
  ['2026-09-26', 'booked', undefined, 'Wedding — Hanna & Leo, Skansen'],
  ['2026-10-03', 'booked'],
  ['2026-10-17', 'booked', undefined, 'Wedding — deposit paid'],
  ['2026-10-24', 'tentative', undefined, 'Holding for inquiry from M. Berg until 1 Oct'],
  ['2026-12-12', 'booked', 'Winter wedding'],
  ['2027-05-22', 'booked'],
  ['2027-06-05', 'booked', undefined, 'Wedding — Gotland, travel day before'],
  ['2027-06-12', 'booked'],
  ['2027-06-19', 'tentative', 'Midsummer'],
  ['2027-06-26', 'booked'],
  ['2027-07-03', 'booked'],
  ['2027-07-10', 'tentative'],
  ['2027-08-07', 'booked'],
  ['2027-08-21', 'booked'],
  ['2027-09-04', 'booked'],
]
for (const [date, status, label, note] of dates) {
  await create('availability', { date: `${date}T12:00:00.000Z`, status, label, note })
}

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

const journalCat = await create('post-categories', { title: 'Wedding planning' })
const journalCat2 = await create('post-categories', { title: 'Behind the lens' })

await create('posts', {
  title: 'How to plan a relaxed wedding timeline',
  excerpt: 'A few gentle rules that give your day — and your photographs — room to breathe.',
  cover: media.table,
  categories: [journalCat.id],
  tags: ['weddings', 'planning', 'timeline'],
  publishedAt: '2026-08-14T09:00:00.000Z',
  _status: 'published',
  content: doc(
    p('The most beautiful wedding photographs rarely come from a rushed schedule. Here is how I help couples build a day with space in it.'),
    h('h2', 'Start with the light'),
    p('Sunset time shapes the whole day. In a Swedish summer the golden hour can arrive after nine in the evening, so we plan portraits around it rather than squeezing them in.'),
    block({ blockType: 'gallery', images: m('bouquetGlow', 'goldenCouple'), columns: '2' }),
    h('h2', 'Add buffers everywhere'),
    ul(['Fifteen minutes between getting ready and leaving', 'A quiet moment alone after the ceremony', 'Time for the family photographs you truly want']),
    quote('The best moments happen when nobody is looking at the clock.'),
    p('If you would like help with your own timeline, **get in touch** — I am happy to share a template.'),
  ),
})

await create('posts', {
  title: 'Why I photograph with natural light',
  excerpt: 'On soft windows, long shadows and letting a place speak for itself.',
  cover: media.bouquetSky,
  categories: [journalCat2.id],
  tags: ['light', 'approach'],
  publishedAt: '2026-05-02T09:00:00.000Z',
  _status: 'published',
  content: doc(
    p('Natural light is honest. It changes with the weather and the hour, and it makes every photograph belong to a specific moment.'),
    upload(media.shadows),
    h('h2', 'Working with what is there'),
    p('Rather than bringing a studio to your wedding, I look for windows, open shade and the low evening sun. It keeps the day unobtrusive and the images timeless.'),
  ),
})

/* ------------------------------------------------------------------ */
/* Globals                                                             */
/* ------------------------------------------------------------------ */

await payload.updateGlobal({
  slug: 'site-settings',
  context,
  data: {
    siteName: 'RB Studio',
    tagline: 'Wedding & portrait photographer',
    copyright: '© {year} RB Studio. All rights reserved.',
    email: 'hello@rbstudio.se',
    phone: '+46 70 000 00 00',
    formIntro: 'Tell me a little about your plans. I personally reply to every message within two working days.',
    budgetOptions: ['Under 15 000 SEK', '15 000 – 25 000 SEK', '25 000 – 40 000 SEK', '40 000 SEK +', 'Not sure yet'].map((label) => ({ label })),
    hoursOptions: ['1–2 hours', '4 hours', '6 hours', '8 hours', '10+ hours / full day'].map((label) => ({ label })),
    consentText: 'I agree that RB Studio stores my details in order to answer my inquiry.',
    successHeading: 'Thank you.',
    successMessage: 'Your message has arrived. I personally reply to every inquiry within two working days — keep an eye on your inbox.',
    headerLinks: [
      { label: 'Portfolio', url: '/portfolio' },
      { label: 'Services', url: '/services' },
      { label: 'About', url: '/about' },
      { label: 'Pricing', url: '/pricing' },
      { label: 'FAQ', url: '/faq' },
      { label: 'Journal', url: '/journal' },
      { label: 'Contact', url: '/contact' },
    ],
    headerCtaLabel: 'Check availability',
    headerCtaUrl: '/availability',
    footerHeading: 'Let’s create something timeless.',
    footerText: 'Wedding, portrait and editorial photography — based in Stockholm, available worldwide.',
    footerLinks: [
      { label: 'Portfolio', url: '/portfolio' },
      { label: 'Services', url: '/services' },
      { label: 'Pricing', url: '/pricing' },
      { label: 'About', url: '/about' },
      { label: 'Availability', url: '/availability' },
      { label: 'Journal', url: '/journal' },
      { label: 'Contact', url: '/contact' },
    ],
    legalLinks: [
      { label: 'Privacy policy', url: '/privacy-policy' },
      { label: 'Cookie policy', url: '/cookie-policy' },
      { label: 'Terms & conditions', url: '/terms' },
    ],
    social: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'facebook', url: 'https://www.facebook.com/' },
      { platform: 'pinterest', url: 'https://www.pinterest.com/' },
    ],
    instagramHandle: '@rbstudio',
    seoTitle: 'RB Studio — Wedding & Portrait Photographer in Stockholm',
    seoTitleSuffix: ' — RB Studio',
    seoDescription:
      'Timeless, emotional and authentic photography for weddings, portraits, brands and special moments. Based in Stockholm, available worldwide.',
    ogImage: media.seaVeil,
    priceRange: '$$$',
    city: 'Stockholm',
    region: 'Stockholms län',
    country: 'SE',
    latitude: 59.3293,
    longitude: 18.0686,
    serviceAreas: ['Stockholm', 'Uppsala', 'Gotland', 'Sweden', 'Destination weddings'].map((name) => ({ name })),
    cookieBannerEnabled: true,
    cookieText: 'I use cookies to understand how the site is used and to improve it. You decide what to allow.',
    cookiePolicyUrl: '/cookie-policy',
  } as never,
})

await payload.updateGlobal({
  slug: 'about',
  context,
  data: {
    name: 'RB Studio',
    role: 'Photographer & founder',
    location: 'Based in Stockholm · Available worldwide',
    portrait: media.cameraSun,
    secondaryImage: media.mountain,
    headline: 'Hello — I’m the eye behind RB Studio.',
    bio: paragraphs(`
I photograph people in the moments that matter to them: weddings, families, portraits and the stories brands want to tell. My work is quiet and observant — I would rather catch the glance between two people than stage a perfect pose.

I believe the best photographs are honest ones. They hold the light of a particular evening, the weather of a particular day, and the feeling of being exactly where you were.

When I am not photographing, you will find me walking the archipelago with a film camera, looking for the next beautiful window of light.`),
    philosophy: 'Photographs should feel like the day felt — not like a performance of it.',
    style:
      'Documentary at heart, editorial in eye. Natural light, calm direction and a timeless, softly warm colour palette that will still feel right in thirty years.',
    experience: [
      { value: '10+', label: 'Years behind the camera' },
      { value: '250+', label: 'Weddings & sessions' },
      { value: '12', label: 'Countries photographed in' },
    ],
    facts: [
      { label: 'Favourite light', value: 'Late August, 8 pm' },
      { label: 'Always in my bag', value: 'A 35mm lens & a spare hair tie' },
      { label: 'Coffee', value: 'Oat flat white' },
    ],
    publications: [
      { name: 'Sample Wedding Magazine', year: '2025' },
      { name: 'Sample Nordic Bride', year: '2024' },
    ],
    awards: [{ name: 'Sample award — Best wedding story', issuer: 'Sample photography awards', year: '2025' }],
  } as never,
})

/* ------------------------------------------------------------------ */
/* Pages (all built from editable sections)                            */
/* ------------------------------------------------------------------ */

const S = (blockType: string, fields: Record<string, unknown> = {}) => ({
  blockType,
  blockName: typeof fields.heading === 'string' ? fields.heading.replace(/\*/g, '') : undefined,
  enabled: true,
  tone: 'light',
  ...fields,
})

const contactCta = S('cta', {
  eyebrow: 'Let’s work together',
  heading: 'Tell me about your *story*.',
  text: 'Dates for next season are booking now. Send a few lines and I will get back to you personally.',
  button: { label: 'Check availability', url: '/availability' },
  image: media.goldenCouple,
})

const pages = [
  {
    title: 'Home',
    slug: 'home',
    meta: { title: 'RB Studio — Wedding & Portrait Photographer in Stockholm' },
    layout: [
      S('hero', {
        slides: m('seaVeil', 'confetti', 'hills', 'bouquetGlow'),
        eyebrow: 'RB Studio · Stockholm',
        heading: 'Photography that tells your *story*.',
        subheading: 'Timeless, emotional and authentic photography for weddings, portraits, brands and special moments.',
        primaryCta: { label: 'Check availability', url: '/availability' },
        secondaryCta: { label: 'View portfolio', url: '/portfolio' },
        height: 'full',
        overlay: 30,
        interval: 6,
        showScrollIndicator: true,
      }),
      S('intro', {
        eyebrow: 'Welcome',
        heading: 'Images that feel like *you*.',
        text: 'I photograph real moments with a calm, editorial eye — the glance across the room, the laugh you didn’t expect, the light of one particular evening.\n\nMy approach is quiet and personal. Less posing, more presence. The result is a collection of photographs that will feel as true in thirty years as they do today.',
        secondaryImage: media.bouquetPeach,
        cta: { label: 'Meet the photographer', url: '/about' },
      }),
      S('featuredPortfolio', {
        eyebrow: 'Portfolio',
        heading: 'Selected work',
        text: 'Weddings, couples, portraits and commissions — a few of the stories I have been trusted with.',
        mode: 'featured',
        limit: 6,
        showCategories: true,
        cta: { label: 'View the full portfolio', url: '/portfolio' },
      }),
      S('imageBanner', {
        image: media.bwKiss,
        quote: 'The best moments happen when nobody is looking at the clock.',
        attribution: 'RB Studio',
        height: 'full',
        parallax: true,
      }),
      S('featuredStory', { tone: 'dark', eyebrow: 'Featured story', project: projects['Anna & Erik'], imageCount: 5, ctaLabel: 'Read the story' }),
      S('services', { eyebrow: 'Services', heading: 'What I offer', text: 'Every commission is personal. Choose a starting point — we will shape the rest together.', mode: 'all' }),
      S('process', { tone: 'sand', eyebrow: 'The experience', heading: 'How it works', text: 'From the first message to the final gallery, everything is simple, personal and unhurried.' }),
      S('pricing', {
        eyebrow: 'Wedding collections',
        heading: 'Investment',
        text: 'Transparent packages for the most common wedding days. Everything can be tailored.',
        mode: 'all',
        footnote: 'Travel within Stockholm county is included. Destination weddings are quoted individually.',
      }),
      S('testimonials', { tone: 'dark', eyebrow: 'Kind words', heading: 'From the people in the pictures', mode: 'featured', limit: 6 }),
      S('availability', {
        tone: 'sand',
        eyebrow: 'Availability',
        heading: 'Booked dates',
        text: 'The dates below are already taken. If yours isn’t listed, it is most likely still available.',
        monthsAhead: 14,
        showTentative: true,
        cta: { label: 'Ask about your date', url: '/contact' },
      }),
      S('faq', { eyebrow: 'Good to know', heading: 'Questions & answers', limit: 5, cta: { label: 'All questions', url: '/faq' } }),
      S('instagram', { eyebrow: 'Instagram', heading: 'Follow along', source: 'manual', images: m('bouquetGlow', 'rings', 'road', 'heart', 'aisle', 'pink'), limit: 6 }),
      S('contact', {
        eyebrow: 'Contact',
        heading: 'Let’s work together',
        text: 'Tell me about your plans — the date, the place, the feeling you are hoping for.',
        image: media.goldenCouple,
        showDetails: true,
      }),
    ],
  },
  {
    title: 'About',
    slug: 'about',
    meta: { title: 'About the photographer', description: 'Meet the photographer behind RB Studio — a calm, editorial approach to weddings, portraits and brand stories.' },
    layout: [
      S('about', { showExperience: true, showPhilosophy: true, showPublications: true, showAwards: true }),
      S('imageBanner', { image: media.valley, height: 'tall', parallax: true, quote: 'Honest light. Real moments. Nothing staged.' }),
      S('process', { eyebrow: 'Working together', heading: 'The experience' }),
      S('testimonials', { tone: 'sand', eyebrow: 'Kind words', heading: 'What clients say', mode: 'all' }),
      contactCta,
    ],
  },
  {
    title: 'Portfolio',
    slug: 'portfolio',
    meta: { title: 'Portfolio', description: 'Weddings, couples, portraits, families, events and editorial work by RB Studio.' },
    layout: [
      S('pageHeader', { eyebrow: 'Portfolio', heading: 'Stories, *told honestly*.', text: 'A selection of weddings, portraits and commissions. Choose a category or scroll through everything.' }),
      S('portfolioIndex', { showCategoryFilter: true, limit: 60 }),
      contactCta,
    ],
  },
  {
    title: 'Services',
    slug: 'services',
    meta: { title: 'Photography services', description: 'Wedding, portrait, family, commercial, event and editorial photography in Stockholm and beyond.' },
    layout: [
      S('pageHeader', { eyebrow: 'Services', heading: 'Photography, *made personal*.', text: 'Every commission starts with a conversation. Here is where we can begin.' }),
      S('services', { mode: 'all' }),
      S('process', { tone: 'sand', eyebrow: 'The experience', heading: 'How it works' }),
      S('faq', { eyebrow: 'Good to know', heading: 'Questions', limit: 6, cta: { label: 'All questions', url: '/faq' } }),
      contactCta,
    ],
  },
  {
    title: 'Pricing',
    slug: 'pricing',
    meta: { title: 'Pricing & packages', description: 'Wedding photography packages and pricing from RB Studio. Transparent, tailored and personal.' },
    layout: [
      S('pageHeader', { eyebrow: 'Pricing', heading: 'Investment', text: 'Clear packages for the most common wedding days — and happy to tailor anything to yours.' }),
      S('pricing', { mode: 'all', footnote: 'All prices include VAT. Travel within Stockholm county is included; destination weddings are quoted individually.' }),
      S('services', { tone: 'sand', eyebrow: 'Other services', heading: 'Portraits, families & brands', mode: 'all' }),
      S('faq', { eyebrow: 'Booking', heading: 'Booking questions', topic: 'Booking' }),
      contactCta,
    ],
  },
  {
    title: 'FAQ',
    slug: 'faq',
    meta: { title: 'Frequently asked questions', description: 'Answers to common questions about booking, weddings, delivery and portrait sessions with RB Studio.' },
    layout: [
      S('pageHeader', { eyebrow: 'FAQ', heading: 'Questions & *answers*', text: 'Everything you might want to know before we work together. Can’t find your answer? Just ask.' }),
      S('faq', { heading: 'Good to know', groupByTopic: true, cta: { label: 'Ask a question', url: '/contact' } }),
      contactCta,
    ],
  },
  {
    title: 'Availability',
    slug: 'availability',
    meta: { title: 'Availability', description: 'See which dates are already booked and ask about yours.' },
    layout: [
      S('pageHeader', { eyebrow: 'Availability', heading: 'Is your date *still free*?', text: 'Below are the dates already booked. If yours isn’t listed, send an inquiry — it is probably available.' }),
      S('availability', { heading: '', monthsAhead: 18, showTentative: true }),
      S('contact', { eyebrow: 'Reserve your date', heading: 'Ask about your date', image: media.shadows, showDetails: true }),
    ],
  },
  {
    title: 'Contact',
    slug: 'contact',
    meta: { title: 'Contact', description: 'Get in touch with RB Studio about your wedding, portrait session or commission.' },
    layout: [
      S('contact', {
        eyebrow: 'Contact',
        heading: 'Let’s work together',
        text: 'Share a little about your plans. I read every message personally and reply within two working days.',
        image: media.goldenCouple,
        showDetails: true,
      }),
      S('faq', { eyebrow: 'Before you write', heading: 'Quick answers', topic: 'Booking' }),
    ],
  },
  {
    title: 'Journal',
    slug: 'journal',
    meta: { title: 'Journal', description: 'Wedding planning advice, recent stories and thoughts from behind the lens.' },
    layout: [
      S('pageHeader', { eyebrow: 'Journal', heading: 'Notes from *behind the lens*.', text: 'Planning advice, recent work and thoughts on light and storytelling.' }),
      S('journalList', { limit: 12 }),
    ],
  },
]

const legalNote = p('*This is a starting template. Please review and adapt it with a legal advisor before publishing.*')
const legal = [
  {
    title: 'Privacy policy',
    slug: 'privacy-policy',
    content: doc(
      legalNote,
      h('h2', 'Who is responsible for your data'),
      p('RB Studio is the data controller for the personal data described in this policy. You can reach me at the email address shown on the contact page.'),
      h('h2', 'What I collect and why'),
      ul([
        'Details you send through the inquiry form (name, contact details, date, location, budget and message) — to answer your inquiry and prepare an offer.',
        'Client information needed to fulfil a booking and meet bookkeeping obligations.',
        'Anonymous usage statistics, only if you accept analytics cookies.',
      ]),
      h('h2', 'Legal basis and retention'),
      p('Inquiries are processed on the basis of your consent and our legitimate interest in replying. Inquiries that do not lead to a booking are deleted within 12 months. Booking data is kept as long as required by Swedish accounting law.'),
      h('h2', 'Your rights'),
      p('Under the GDPR you have the right to access, correct, delete or restrict the processing of your data, and to object or withdraw consent. You may also lodge a complaint with the Swedish Authority for Privacy Protection (IMY).'),
    ),
  },
  {
    title: 'Cookie policy',
    slug: 'cookie-policy',
    content: doc(
      legalNote,
      h('h2', 'What cookies are'),
      p('Cookies are small text files stored in your browser. This website only uses the strictly necessary storage it needs to work, unless you choose to allow more.'),
      h('h2', 'Categories'),
      ul([
        '**Necessary** — remembers your cookie choice. Always on.',
        '**Analytics** — helps me understand how the site is used (e.g. Google Analytics). Only with your consent.',
        '**Marketing** — measures the effect of advertising (e.g. Meta Pixel). Only with your consent.',
      ]),
      h('h2', 'Changing your choice'),
      p('You can change your choice at any time using the “Cookie settings” link in the footer.'),
    ),
  },
  {
    title: 'Terms & conditions',
    slug: 'terms',
    content: doc(
      legalNote,
      h('h2', 'Bookings'),
      p('A date is reserved when the agreement is signed and the booking fee is paid. The booking fee is non-refundable.'),
      h('h2', 'Payment'),
      p('The remaining balance is due 30 days before the photography date unless otherwise agreed.'),
      h('h2', 'Copyright and usage'),
      p('RB Studio retains the copyright to all images. Private clients receive a licence for personal use; commercial usage is defined in each quote.'),
      h('h2', 'Cancellation'),
      p('Cancellation terms are described in your individual agreement.'),
    ),
  },
]

for (const pg of pages) await create('pages', { ...pg, _status: 'published' })
for (const lg of legal) {
  await create('pages', {
    title: lg.title,
    slug: lg.slug,
    _status: 'published',
    meta: { title: lg.title },
    layout: [S('pageHeader', { eyebrow: 'Legal', heading: lg.title }), S('richText', { content: lg.content, width: 'narrow' })],
  })
}

payload.logger.info('──────────────────────────────────────────────')
payload.logger.info('Seed complete.')
payload.logger.info(`Admin login:  ${adminEmail}`)
payload.logger.info(`Password:     ${adminPassword}`)
payload.logger.info('Change this password after your first login (Account → Change password).')
payload.logger.info('──────────────────────────────────────────────')
process.exit(0)
