import Link from 'next/link'
import React from 'react'
import type {
  Category,
  FeaturedPortfolioBlock,
  FeaturedStoryBlock,
  Media,
  PortfolioIndexBlock,
  Project,
} from '@/payload-types'
import { getCategories, getProjects } from '@/lib/data'
import { asDoc, asDocs, asMedia, cx, formatDate } from '@/lib/utils'
import { Frame } from '../Img'
import { composeStory, type Chapter } from '@/lib/story'
import { CtaLink, Section, SectionHead } from './shared'

/* ---------- Cards & grids ---------- */

const gridSizes = [
  '(min-width: 800px) 58vw, 100vw',
  '(min-width: 800px) 33vw, 84vw',
  '(min-width: 800px) 66vw, 100vw',
  '(min-width: 800px) 42vw, 84vw',
  '(min-width: 800px) 50vw, 100vw',
  '100vw',
]

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <p className="empty-note">New work is on its way.</p>
  return (
    <div className="editorial">
      {projects.map((p, i) => {
        const category = asDoc<Category>(p.category)
        return (
          <article key={p.id} className="editorial__item" data-reveal>
            <Link href={`/stories/${p.slug}`} aria-label={`${p.title}${p.location ? ` — ${p.location}` : ''}`}>
              <Frame media={p.cover} hover sizes={gridSizes[i % 6]} reveal={false} />
              <div className="card-caption">
                <h3 className="card-caption__title">{p.title}</h3>
                <span className="card-caption__meta">{[p.location, category?.title].filter(Boolean).join(' · ')}</span>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export async function CategoryNav({ current }: { current?: string }) {
  const categories = await getCategories()
  if (categories.length === 0) return null
  return (
    <nav aria-label="Portfolio categories">
      <ul className="category-nav">
        <li>
          <Link href="/portfolio" aria-current={!current ? 'page' : undefined}>
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/portfolio/${c.slug}`} aria-current={current === c.slug ? 'page' : undefined}>
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- Homepage: featured portfolio ---------- */

export async function FeaturedPortfolio({ block }: { block: FeaturedPortfolioBlock }) {
  const limit = block.limit ?? 6
  let projects: Project[] = []
  if (block.mode === 'selected') {
    projects = asDocs<Project>(block.projects).filter((p) => p._status !== 'draft').slice(0, limit)
  } else if (block.mode === 'category' && block.category) {
    const id = typeof block.category === 'object' ? block.category.id : block.category
    projects = await getProjects({ category: { equals: id } }, limit)
  } else {
    projects = await getProjects({ featured: { equals: true } }, limit)
    if (projects.length === 0) projects = await getProjects(undefined, limit)
  }

  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} text={block.text}>
          {block.showCategories && (
            <div style={{ marginTop: block.text ? '1.8rem' : 0 }}>
              <CategoryNav />
            </div>
          )}
        </SectionHead>
        <ProjectGrid projects={projects} />
        {block.cta?.label && (
          <div className="section-foot">
            <CtaLink link={block.cta} className="btn" arrow={false} />
          </div>
        )}
      </div>
    </Section>
  )
}

/* ---------- Homepage: featured story ---------- */

// Collage rhythm: full-width landscape, two portraits side by side, then an inset landscape.
const storyRatios = ['landscape', 'portrait', 'portrait', 'landscape'] as const

export function FeaturedStory({ block }: { block: FeaturedStoryBlock }) {
  const project = asDoc<Project>(block.project)
  if (!project) return null
  const images = [project.cover, ...(project.gallery ?? [])]
    .map(asMedia)
    .filter((m): m is Media => Boolean(m))
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, block.imageCount ?? 5)
  const category = asDoc<Category>(project.category)

  return (
    <Section block={{ ...block, tone: block.tone || 'dark' }}>
      <div className="container story-feature">
        <div className="story-feature__text">
          <p className="eyebrow" data-reveal>
            {block.eyebrow || 'Featured story'}
          </p>
          <h2 className="h2" data-reveal>
            {block.headingOverride || project.title}
          </h2>
          <p className="story-feature__meta small-caps" data-reveal>
            {[project.location, formatDate(project.date, { month: 'long', year: 'numeric' }), category?.title]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {(block.textOverride || project.excerpt) && (
            <p className="lede" data-reveal>
              {block.textOverride || project.excerpt}
            </p>
          )}
          <div data-reveal>
            <Link href={`/stories/${project.slug}`} className="link">
              {block.ctaLabel || 'Read the story'} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
        <div className="story-feature__images">
          {images.map((m, i) => (
            <Link key={m.id} href={`/stories/${project.slug}`} tabIndex={-1} aria-hidden="true">
              <Frame
                media={m}
                ratio={storyRatios[i % 4]}
                hover
                sizes={i % 4 === 0 ? '(min-width: 960px) 58vw, 100vw' : '(min-width: 960px) 30vw, 50vw'}
              />
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ---------- Portfolio overview ---------- */

export async function PortfolioIndex({ block }: { block: PortfolioIndexBlock }) {
  const projects = await getProjects(undefined, block.limit ?? 60)
  return (
    <Section block={block} style={{ paddingTop: 0 }}>
      <div className="container">
        {block.showCategoryFilter && (
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <CategoryNav />
          </div>
        )}
        <ProjectGrid projects={projects} />
      </div>
    </Section>
  )
}

/* ---------- Story layout ---------- */

const rowSizes: Record<string, string> = {
  full: '100vw',
  inset: '(min-width: 800px) 84vw, 100vw',
  'portrait-left': '(min-width: 800px) 42vw, 100vw',
  'portrait-right': '(min-width: 800px) 42vw, 100vw',
  pair: '50vw',
}

export function StoryFlow({ images, chapters }: { images: Media[]; chapters?: Chapter[] }) {
  const rows = composeStory(images, chapters)
  return (
    <div className="story-flow">
      {rows.map((row, idx) => {
        if (row.kind === 'chapter') {
          return (
            <div key={`c${idx}`} className="story-chapter" data-reveal>
              {row.chapter.heading && <h2>{row.chapter.heading}</h2>}
              <p>{row.chapter.text}</p>
            </div>
          )
        }
        return (
          <div key={`r${idx}`} className={cx('story-row', `story-row--${row.kind}`)}>
            {row.images.map((m) => (
              <figure key={m.id} style={{ margin: 0 }}>
                <Frame media={m} natural sizes={rowSizes[row.kind]} />
                {m.caption && <figcaption className="caption">{m.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )
      })}
    </div>
  )
}
