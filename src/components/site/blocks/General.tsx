import React from 'react'
import type {
  CtaBlock,
  GalleryBlock,
  HeroBlock,
  ImageBannerBlock,
  IntroBlock,
  PageHeaderBlock,
  RichTextBlock,
} from '@/payload-types'
import { getAbout } from '@/lib/data'
import { asMedia, cx } from '@/lib/utils'
import { Frame, Img } from '../Img'
import { RichText } from '../RichText'
import { CtaLink, Emphasis, Section, SectionHead } from './shared'
import { HeroSlides } from './HeroSlides'
import { StoryFlow } from './Portfolio'

export function Hero({ block, isFirst }: { block: HeroBlock; isFirst: boolean }) {
  const slides = (block.slides ?? []).map(asMedia).filter((m): m is NonNullable<typeof m> => Boolean(m))
  const H = isFirst ? 'h1' : 'h2'
  return (
    <section
      id={block.anchor || undefined}
      className={cx('hero', block.height === 'tall' && 'hero--tall')}
      data-header-overlay={isFirst ? '' : undefined}
      style={{ ['--overlay' as string]: (block.overlay ?? 35) / 100 }}
    >
      <HeroSlides slides={slides} interval={block.interval ?? 6} />
      <div className="hero__shade" />
      <div className="container hero__content">
        {block.eyebrow && <p className="eyebrow hero__eyebrow">{block.eyebrow}</p>}
        <H className="display hero__title">
          <Emphasis text={block.heading} />
        </H>
        {block.subheading && <p className="hero__sub">{block.subheading}</p>}
        <div className="hero__actions">
          <CtaLink link={block.primaryCta} className="btn btn--light" arrow={false} />
          <CtaLink link={block.secondaryCta} className="link" />
        </div>
      </div>
      {block.showScrollIndicator && (
        <a href="#content-start" className="hero__scroll">
          Scroll
        </a>
      )}
      <span id="content-start" style={{ position: 'absolute', bottom: 0 }} />
    </section>
  )
}

export function PageHeader({ block, isFirst }: { block: PageHeaderBlock; isFirst: boolean }) {
  const image = asMedia(block.image)
  const H = isFirst ? 'h1' : 'h2'
  if (image) {
    return (
      <section
        id={block.anchor || undefined}
        className="page-header page-header--image"
        data-header-overlay={isFirst ? '' : undefined}
      >
        <div className="page-header__bg">
          <Img media={image} priority={isFirst} />
        </div>
        <div className="container">
          {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
          <H className="display" style={{ whiteSpace: 'pre-line' }}>
            <Emphasis text={block.heading} />
          </H>
          {block.text && <p className="page-header__text">{block.text}</p>}
        </div>
      </section>
    )
  }
  return (
    <section id={block.anchor || undefined} className={cx('page-header', `tone-${block.tone || 'light'}`)} style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="container">
        {block.eyebrow && (
          <p className="eyebrow" data-reveal>
            {block.eyebrow}
          </p>
        )}
        <H className="display" style={{ whiteSpace: 'pre-line' }} data-reveal>
          <Emphasis text={block.heading} />
        </H>
        {block.text && (
          <p className="page-header__text lede" data-reveal style={{ ['--d' as string]: 1 }}>
            {block.text}
          </p>
        )}
      </div>
    </section>
  )
}

export async function Intro({ block }: { block: IntroBlock }) {
  const about = await getAbout()
  const image = asMedia(block.image) || asMedia(about.portrait)
  const secondary = asMedia(block.secondaryImage)
  const paragraphs = (block.text || '').split(/\n\s*\n/).filter(Boolean)
  const [lead, ...rest] = paragraphs
  return (
    <Section block={block}>
      <div className="container intro">
        <div className="intro__text">
          {block.eyebrow && (
            <p className="eyebrow" data-reveal>
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="h2" data-reveal>
              <Emphasis text={block.heading} />
            </h2>
          )}
          {lead && (
            <p className="lede" data-reveal style={{ ['--d' as string]: 1 }}>
              {lead}
            </p>
          )}
          {rest.length > 0 && (
            <div className="intro__body" data-reveal style={{ ['--d' as string]: 2 }}>
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          <div data-reveal style={{ ['--d' as string]: 3 }}>
            <CtaLink link={block.cta} />
          </div>
        </div>
        {image && (
          <div className="intro__media">
            <Frame media={image} ratio="portrait" sizes="(min-width: 960px) 38vw, 90vw" />
            {secondary && (
              <div className="intro__secondary">
                <Frame media={secondary} ratio="portrait" sizes="(min-width: 960px) 18vw, 40vw" />
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}

export function RichTextSection({ block }: { block: RichTextBlock }) {
  return (
    <Section block={block}>
      <div className={cx('container', block.width === 'wide' ? 'container--narrow' : 'container--text')}>
        {block.heading && (
          <h2 className="h2" style={{ marginBottom: '2.5rem' }} data-reveal>
            {block.heading}
          </h2>
        )}
        <div data-reveal>
          <RichText data={block.content} />
        </div>
      </div>
    </Section>
  )
}

export function ImageBanner({ block, isFirst }: { block: ImageBannerBlock; isFirst: boolean }) {
  const image = asMedia(block.image)
  if (!image) return null
  return (
    <section
      id={block.anchor || undefined}
      className={cx('banner', `banner--${block.height || 'tall'}`, block.quote && 'banner--quote')}
      data-header-overlay={isFirst ? '' : undefined}
    >
      <div className={cx('banner__bg', block.parallax && 'parallax')}>
        <Img media={image} priority={isFirst} />
      </div>
      {block.quote && (
        <div className="banner__quote" data-reveal>
          <blockquote>{block.quote}</blockquote>
          {block.attribution && <cite>{block.attribution}</cite>}
        </div>
      )}
    </section>
  )
}

export function Cta({ block }: { block: CtaBlock }) {
  const image = asMedia(block.image)
  return (
    <Section block={block} className={cx('cta', image && 'cta--image')}>
      {image && (
        <div className="cta__bg parallax">
          <Img media={image} />
        </div>
      )}
      <div className="container">
        {block.eyebrow && (
          <p className="eyebrow" style={{ justifyContent: 'center' }} data-reveal>
            {block.eyebrow}
          </p>
        )}
        {block.heading && (
          <h2 className="h2" data-reveal>
            <Emphasis text={block.heading} />
          </h2>
        )}
        {block.text && (
          <p className="cta__text" data-reveal>
            {block.text}
          </p>
        )}
        <div data-reveal style={{ ['--d' as string]: 1 }}>
          <CtaLink link={block.button} className={cx('btn', image && 'btn--light')} arrow={false} />
        </div>
      </div>
    </Section>
  )
}

export function Gallery({ block }: { block: GalleryBlock }) {
  const images = (block.images ?? []).map(asMedia).filter((m): m is NonNullable<typeof m> => Boolean(m))
  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} />
        <StoryFlow images={images} />
      </div>
    </Section>
  )
}
