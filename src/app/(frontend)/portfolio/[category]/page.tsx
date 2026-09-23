import { notFound } from 'next/navigation'
import React from 'react'
import { getCategories, getCategoryBySlug, getProjects } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { asMedia } from '@/lib/utils'
import { Img } from '@/components/site/Img'
import { CategoryNav, ProjectGrid } from '@/components/site/blocks/Portfolio'
import { JsonLd } from '@/components/site/JsonLd'
import { serverUrl } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.filter((c) => c.slug).map((c) => ({ category: c.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  return buildMetadata({
    meta: cat.meta,
    title: `${cat.title} — Portfolio`,
    description: cat.description,
    image: cat.cover,
    path: `/portfolio/${category}`,
  })
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()
  const projects = await getProjects({ category: { equals: cat.id } }, 200)
  const cover = asMedia(cat.cover)

  return (
    <>
      {cover ? (
        <section className="page-header page-header--image" data-header-overlay="" style={{ minHeight: '75svh' }}>
          <div className="page-header__bg">
            <Img media={cover} priority />
          </div>
          <div className="container">
            <p className="eyebrow">{cat.eyebrow || 'Portfolio'}</p>
            <h1 className="display">{cat.title}</h1>
            {cat.description && <p className="page-header__text">{cat.description}</p>}
          </div>
        </section>
      ) : (
        <section className="page-header">
          <div className="container">
            <p className="eyebrow">{cat.eyebrow || 'Portfolio'}</p>
            <h1 className="display">{cat.title}</h1>
            {cat.description && <p className="page-header__text lede">{cat.description}</p>}
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <CategoryNav current={category} />
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Portfolio', item: `${serverUrl()}/portfolio` },
            { '@type': 'ListItem', position: 2, name: cat.title, item: `${serverUrl()}/portfolio/${category}` },
          ],
        }}
      />
    </>
  )
}
