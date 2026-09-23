import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export const revalidate = 3600

export const generateMetadata = () => cmsPageMetadata('home')

export default function HomePage() {
  return <CmsPage slug="home" />
}
