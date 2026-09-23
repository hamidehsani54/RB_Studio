import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export const revalidate = 3600

export const generateMetadata = () => cmsPageMetadata('services')

export default function Page() {
  return <CmsPage slug="services" />
}
