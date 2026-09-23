import type { Block, Field } from 'payload'
import { linkGroup } from '../fields'

/** Settings shared by every section: on/off switch, colour tone and anchor. */
const sectionSettings: Field = {
  type: 'collapsible',
  label: 'Section settings',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show this section',
          defaultValue: true,
          admin: { width: '33%' },
        },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Ivory', value: 'light' },
            { label: 'Warm sand', value: 'sand' },
            { label: 'Dark', value: 'dark' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'anchor',
          type: 'text',
          admin: { width: '33%', description: 'Optional ID for links like /#pricing' },
        },
      ],
    },
  ],
}

const eyebrow: Field = {
  name: 'eyebrow',
  type: 'text',
  admin: { description: 'Small label above the heading' },
}
const heading = (defaultValue?: string): Field => ({ name: 'heading', type: 'text', defaultValue })
const text: Field = { name: 'text', type: 'textarea' }

const mode = (options: { label: string; value: string }[], defaultValue: string): Field => ({
  name: 'mode',
  type: 'radio',
  label: 'What to show',
  defaultValue,
  options,
  admin: { layout: 'horizontal' },
})

const whenMode = (value: string) => ({
  condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.mode === value,
})

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero (full-screen photography)', plural: 'Hero sections' },
  interfaceName: 'HeroBlock',
  fields: [
    sectionSettings,
    {
      name: 'slides',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: { description: 'One image, or several for a slow cross-fading slideshow. Drag to reorder.' },
    },
    eyebrow,
    { name: 'heading', type: 'textarea', required: true },
    { name: 'subheading', type: 'textarea' },
    {
      type: 'row',
      fields: [
        linkGroup('primaryCta', 'Primary button', { label: 'Check availability', url: '/contact' }),
        linkGroup('secondaryCta', 'Secondary button', { label: 'View portfolio', url: '/portfolio' }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'height',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full screen', value: 'full' },
            { label: 'Tall', value: 'tall' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'overlay',
          type: 'number',
          defaultValue: 35,
          min: 0,
          max: 80,
          admin: { width: '33%', description: 'Darkening over the photo (0–80%) for text readability' },
        },
        {
          name: 'interval',
          type: 'number',
          defaultValue: 6,
          min: 3,
          admin: { width: '33%', description: 'Seconds per slide' },
        },
      ],
    },
    { name: 'showScrollIndicator', type: 'checkbox', defaultValue: true },
  ],
}

export const PageHeaderBlock: Block = {
  slug: 'pageHeader',
  labels: { singular: 'Page header', plural: 'Page headers' },
  interfaceName: 'PageHeaderBlock',
  fields: [
    sectionSettings,
    eyebrow,
    { name: 'heading', type: 'textarea', required: true },
    text,
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional full-width image' } },
  ],
}

export const IntroBlock: Block = {
  slug: 'intro',
  labels: { singular: 'Introduction', plural: 'Introductions' },
  interfaceName: 'IntroBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Images that feel like you.'),
    text,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Leave empty to use the portrait from “About the photographer”.' },
    },
    { name: 'secondaryImage', type: 'upload', relationTo: 'media' },
    linkGroup('cta', 'Link', { label: 'Meet the photographer', url: '/about' }),
  ],
}

export const FeaturedPortfolioBlock: Block = {
  slug: 'featuredPortfolio',
  labels: { singular: 'Featured portfolio', plural: 'Featured portfolios' },
  interfaceName: 'FeaturedPortfolioBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Selected work'),
    text,
    mode(
      [
        { label: 'Projects marked “featured”', value: 'featured' },
        { label: 'Choose projects', value: 'selected' },
        { label: 'From a category', value: 'category' },
      ],
      'featured',
    ),
    { name: 'projects', type: 'relationship', relationTo: 'projects', hasMany: true, admin: whenMode('selected') },
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: whenMode('category') },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24 },
    { name: 'showCategories', type: 'checkbox', label: 'Show category links', defaultValue: true },
    linkGroup('cta', 'Link', { label: 'View the full portfolio', url: '/portfolio' }),
  ],
}

export const FeaturedStoryBlock: Block = {
  slug: 'featuredStory',
  labels: { singular: 'Featured story', plural: 'Featured stories' },
  interfaceName: 'FeaturedStoryBlock',
  fields: [
    sectionSettings,
    eyebrow,
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true },
    { name: 'headingOverride', type: 'text', admin: { description: 'Leave empty to use the project title.' } },
    { name: 'textOverride', type: 'textarea', admin: { description: 'Leave empty to use the project introduction.' } },
    { name: 'imageCount', type: 'number', defaultValue: 5, min: 2, max: 12 },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Read the story' },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services', plural: 'Services sections' },
  interfaceName: 'ServicesBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('What I offer'),
    text,
    mode(
      [
        { label: 'All services', value: 'all' },
        { label: 'Choose services', value: 'selected' },
      ],
      'all',
    ),
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, admin: whenMode('selected') },
    linkGroup('cta', 'Link'),
  ],
}

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Pricing', plural: 'Pricing sections' },
  interfaceName: 'PricingBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Collections'),
    text,
    mode(
      [
        { label: 'All packages', value: 'all' },
        { label: 'Choose packages', value: 'selected' },
      ],
      'all',
    ),
    { name: 'packages', type: 'relationship', relationTo: 'packages', hasMany: true, admin: whenMode('selected') },
    { name: 'footnote', type: 'textarea', admin: { description: 'Small print under the packages.' } },
  ],
}

export const ProcessBlock: Block = {
  slug: 'process',
  labels: { singular: 'Process', plural: 'Process sections' },
  interfaceName: 'ProcessBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('How it works'),
    { ...text, admin: { description: 'The steps themselves are managed under Content → Process steps.' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials sections' },
  interfaceName: 'TestimonialsBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Kind words'),
    mode(
      [
        { label: 'Featured testimonials', value: 'featured' },
        { label: 'All testimonials', value: 'all' },
        { label: 'Choose', value: 'selected' },
      ],
      'featured',
    ),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: whenMode('selected'),
    },
    { name: 'limit', type: 'number', defaultValue: 8 },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ sections' },
  interfaceName: 'FaqBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Questions & answers'),
    text,
    { name: 'topic', type: 'text', admin: { description: 'Only show questions with this topic (optional).' } },
    { name: 'groupByTopic', type: 'checkbox', defaultValue: false },
    { name: 'limit', type: 'number', defaultValue: 50 },
    linkGroup('cta', 'Link'),
  ],
}

export const AvailabilityBlock: Block = {
  slug: 'availability',
  labels: { singular: 'Availability', plural: 'Availability sections' },
  interfaceName: 'AvailabilityBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Availability'),
    text,
    {
      type: 'row',
      fields: [
        { name: 'monthsAhead', type: 'number', defaultValue: 18, min: 1, max: 36, admin: { width: '50%' } },
        { name: 'showTentative', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    linkGroup('cta', 'Link', { label: 'Ask about your date', url: '/contact' }),
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Contact / inquiry form', plural: 'Contact sections' },
  interfaceName: 'ContactBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading("Let's work together"),
    text,
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'showDetails', type: 'checkbox', label: 'Show email / phone / location', defaultValue: true },
  ],
}

export const InstagramBlock: Block = {
  slug: 'instagram',
  labels: { singular: 'Instagram / social', plural: 'Instagram sections' },
  interfaceName: 'InstagramBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading('Follow along'),
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'manual',
      options: [
        { label: 'Chosen images', value: 'manual' },
        { label: 'Live Instagram feed (needs access token in Site settings)', value: 'live' },
      ],
    },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'limit', type: 'number', defaultValue: 6 },
  ],
}

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: 'About the photographer', plural: 'About sections' },
  interfaceName: 'AboutBlock',
  fields: [
    sectionSettings,
    {
      type: 'row',
      fields: [
        { name: 'showExperience', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showPhilosophy', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showPublications', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showAwards', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text sections' },
  interfaceName: 'RichTextBlock',
  fields: [
    sectionSettings,
    heading(),
    { name: 'content', type: 'richText' },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (reading)', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
      ],
    },
  ],
}

export const ImageBannerBlock: Block = {
  slug: 'imageBanner',
  labels: { singular: 'Full-width image / quote', plural: 'Image banners' },
  interfaceName: 'ImageBannerBlock',
  fields: [
    sectionSettings,
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'quote', type: 'textarea' },
    { name: 'attribution', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'height',
          type: 'select',
          defaultValue: 'tall',
          options: [
            { label: 'Full screen', value: 'full' },
            { label: 'Tall', value: 'tall' },
            { label: 'Medium', value: 'medium' },
          ],
          admin: { width: '50%' },
        },
        { name: 'parallax', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  interfaceName: 'CtaBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading(),
    text,
    linkGroup('button', 'Button', { label: 'Check availability', url: '/contact' }),
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional background photograph' } },
  ],
}

export const PortfolioIndexBlock: Block = {
  slug: 'portfolioIndex',
  labels: { singular: 'Portfolio overview (all projects)', plural: 'Portfolio overviews' },
  interfaceName: 'PortfolioIndexBlock',
  fields: [
    sectionSettings,
    { name: 'showCategoryFilter', type: 'checkbox', defaultValue: true },
    { name: 'limit', type: 'number', defaultValue: 60 },
  ],
}

export const JournalListBlock: Block = {
  slug: 'journalList',
  labels: { singular: 'Journal articles', plural: 'Journal lists' },
  interfaceName: 'JournalListBlock',
  fields: [sectionSettings, eyebrow, heading(), { name: 'limit', type: 'number', defaultValue: 12 }],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  interfaceName: 'GalleryBlock',
  fields: [
    sectionSettings,
    eyebrow,
    heading(),
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  PageHeaderBlock,
  IntroBlock,
  FeaturedPortfolioBlock,
  FeaturedStoryBlock,
  ServicesBlock,
  PricingBlock,
  ProcessBlock,
  TestimonialsBlock,
  FaqBlock,
  AvailabilityBlock,
  ContactBlock,
  InstagramBlock,
  AboutBlock,
  RichTextBlock,
  ImageBannerBlock,
  CtaBlock,
  PortfolioIndexBlock,
  JournalListBlock,
  GalleryBlock,
]
