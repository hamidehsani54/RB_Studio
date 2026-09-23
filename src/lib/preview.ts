/** Admin "Preview" button → enables draft mode and opens the page on the website. */
export const previewUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const params = new URLSearchParams({ path, secret: process.env.PREVIEW_SECRET || '' })
  return `${base}/next/preview?${params.toString()}`
}
