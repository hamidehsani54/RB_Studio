import { notFound } from 'next/navigation'
import React from 'react'
import type { PostCategory, User } from '@/payload-types'
import { getClient, getPostBySlug, getPosts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { asDoc, asDocs, formatDate, ogImageUrl, serverUrl } from '@/lib/utils'
import { Frame } from '@/components/site/Img'
import { RichText } from '@/components/site/RichText'
import { PostCards } from '@/components/site/blocks/Journal'
import { JsonLd } from '@/components/site/JsonLd'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
  })
  return res.docs.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return buildMetadata({
    meta: post.meta,
    title: post.title,
    description: post.excerpt,
    image: post.cover,
    path: `/journal/${slug}`,
    type: 'article',
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const categories = asDocs<PostCategory>(post.categories)
  const author = asDoc<User>(post.author)
  const related = (await getPosts(4)).filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <article>
      <header className="article-head container container--narrow">
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          {[formatDate(post.publishedAt), categories[0]?.title].filter(Boolean).join(' · ') || 'Journal'}
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 1.6rem + 4.4vw, 6.4rem)' }}>
          {post.title}
        </h1>
        {post.excerpt && <p className="lede">{post.excerpt}</p>}
      </header>
      {post.cover && (
        <div className="container article-cover">
          <Frame media={post.cover} ratio="wide" priority reveal={false} sizes="100vw" />
        </div>
      )}
      <div className="section">
        <div className="container container--text">
          <RichText data={post.content} />
          {(post.tags?.length ?? 0) > 0 && (
            <ul className="tags" aria-label="Tags">
              {post.tags!.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="section tone-sand">
          <div className="container">
            <header className="section-head">
              <p className="eyebrow">More from the journal</p>
            </header>
            <PostCards posts={related} lead={false} />
          </div>
        </section>
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt || undefined,
          image: ogImageUrl(post.cover),
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          author: author ? { '@type': 'Person', name: author.name } : { '@id': `${serverUrl()}/#business` },
          publisher: { '@id': `${serverUrl()}/#business` },
          mainEntityOfPage: `${serverUrl()}/journal/${slug}`,
          keywords: post.tags?.join(', '),
        }}
      />
    </article>
  )
}
