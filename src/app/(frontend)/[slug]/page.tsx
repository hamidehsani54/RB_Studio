import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'
import { getClient } from '@/lib/data'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const payload = await getClient()
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 500,
    select: { slug: true },
  })
  return pages.docs.filter((p) => p.slug && p.slug !== 'home').map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return cmsPageMetadata(slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <CmsPage slug={slug} />
}
