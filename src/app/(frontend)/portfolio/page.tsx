import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export const revalidate = 3600

export const generateMetadata = () => cmsPageMetadata('portfolio')

export default function Page() {
  return <CmsPage slug="portfolio" />
}
