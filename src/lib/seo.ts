import type { Metadata } from 'next'
import { getSettings } from './data'
import { absoluteUrl, ogImageUrl, serverUrl } from './utils'

type Meta =
  | {
      title?: string | null
      description?: string | null
      image?: unknown
      ogTitle?: string | null
      ogDescription?: string | null
      canonical?: string | null
      noIndex?: boolean | null
    }
  | null
  | undefined

export async function buildMetadata({
  meta,
  title,
  description,
  image,
  path,
  type = 'website',
}: {
  meta?: Meta
  title?: string | null
  description?: string | null
  image?: unknown
  path: string
  type?: 'website' | 'article'
}): Promise<Metadata> {
  const settings = await getSettings()
  const finalTitle = meta?.title || title || settings.seoTitle || settings.siteName
  const finalDescription = meta?.description || description || settings.seoDescription || undefined
  const og = ogImageUrl(meta?.image) || ogImageUrl(image) || ogImageUrl(settings.ogImage)
  const url = absoluteUrl(path) || serverUrl()

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: meta?.canonical || url },
    robots: meta?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      siteName: settings.siteName,
      title: meta?.ogTitle || finalTitle,
      description: meta?.ogDescription || finalDescription,
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.ogTitle || finalTitle,
      description: meta?.ogDescription || finalDescription,
      images: og ? [og] : undefined,
    },
  }
}
