import React from 'react'
import type { Page } from '@/payload-types'
import { Cta, Gallery, Hero, ImageBanner, Intro, PageHeader, RichTextSection } from './blocks/General'
import { FeaturedPortfolio, FeaturedStory, PortfolioIndex } from './blocks/Portfolio'
import { Availability, Faq, Pricing, Process, Services } from './blocks/Business'
import { About, Instagram, Testimonials } from './blocks/People'
import { Contact } from './blocks/Contact'
import { JournalList } from './blocks/Journal'

type Block = NonNullable<Page['layout']>[number]

/** Renders the sections of a page in the order chosen in the admin panel. */
export function BlockRenderer({ blocks }: { blocks: Page['layout'] }) {
  const visible = (blocks ?? []).filter((b) => b.enabled !== false)
  return (
    <>
      {visible.map((block, i) => (
        <RenderBlock key={block.id ?? i} block={block} isFirst={i === 0} />
      ))}
    </>
  )
}

function RenderBlock({ block, isFirst }: { block: Block; isFirst: boolean }) {
  switch (block.blockType) {
    case 'hero':
      return <Hero block={block} isFirst={isFirst} />
    case 'pageHeader':
      return <PageHeader block={block} isFirst={isFirst} />
    case 'intro':
      return <Intro block={block} />
    case 'featuredPortfolio':
      return <FeaturedPortfolio block={block} />
    case 'featuredStory':
      return <FeaturedStory block={block} />
    case 'services':
      return <Services block={block} />
    case 'pricing':
      return <Pricing block={block} />
    case 'process':
      return <Process block={block} />
    case 'testimonials':
      return <Testimonials block={block} />
    case 'faq':
      return <Faq block={block} />
    case 'availability':
      return <Availability block={block} />
    case 'contact':
      return <Contact block={block} isFirst={isFirst} />
    case 'instagram':
      return <Instagram block={block} />
    case 'about':
      return <About block={block} isFirst={isFirst} />
    case 'richText':
      return <RichTextSection block={block} />
    case 'imageBanner':
      return <ImageBanner block={block} isFirst={isFirst} />
    case 'cta':
      return <Cta block={block} />
    case 'portfolioIndex':
      return <PortfolioIndex block={block} />
    case 'journalList':
      return <JournalList block={block} />
    case 'gallery':
      return <Gallery block={block} />
    default:
      return null
  }
}
