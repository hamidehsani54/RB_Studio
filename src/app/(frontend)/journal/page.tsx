import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export const revalidate = 3600

export const generateMetadata = () => cmsPageMetadata('journal')

export default function Page() {
  return <CmsPage slug="journal" />
}
