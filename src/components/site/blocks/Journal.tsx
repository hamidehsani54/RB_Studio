import Link from 'next/link'
import React from 'react'
import type { JournalListBlock, Post, PostCategory } from '@/payload-types'
import { getPosts } from '@/lib/data'
import { asDocs, cx, formatDate } from '@/lib/utils'
import { Frame } from '../Img'
import { Section, SectionHead } from './shared'

export function PostCards({ posts, lead = true }: { posts: Post[]; lead?: boolean }) {
  if (posts.length === 0) return <p className="empty-note">The first stories are being written.</p>
  return (
    <div className="journal-grid">
      {posts.map((p, i) => {
        const isLead = lead && i === 0
        const cats = asDocs<PostCategory>(p.categories)
        return (
          <article key={p.id} className={cx('post-card', isLead && 'post-card--lead')} data-reveal>
            <Link href={`/journal/${p.slug}`} aria-hidden="true" tabIndex={-1}>
              <Frame
                media={p.cover}
                ratio={isLead ? 'wide' : 'landscape'}
                hover
                reveal={false}
                sizes={isLead ? '(min-width: 1100px) 62vw, 100vw' : '(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw'}
              />
            </Link>
            <div>
              <p className="post-card__meta">
                {[formatDate(p.publishedAt), cats[0]?.title].filter(Boolean).join(' · ')}
              </p>
              <h3 className="post-card__title">
                <Link href={`/journal/${p.slug}`}>{p.title}</Link>
              </h3>
              {p.excerpt && <p className="post-card__excerpt">{p.excerpt}</p>}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export async function JournalList({ block }: { block: JournalListBlock }) {
  const posts = await getPosts(block.limit ?? 12)
  return (
    <Section block={block}>
      <div className="container">
        <SectionHead eyebrow={block.eyebrow} heading={block.heading} />
        <PostCards posts={posts} />
      </div>
    </Section>
  )
}
