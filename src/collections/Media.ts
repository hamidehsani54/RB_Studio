import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { revalidateHooks } from '../hooks/revalidate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const webp = (quality: number) => ({ format: 'webp' as const, options: { quality } })

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Media library' },
  folders: true,
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'width', 'height', 'updatedAt'],
    description:
      'Upload photographs here (drag & drop several at once). Images are compressed automatically and responsive sizes are generated.',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: {
    ...revalidateHooks,
    beforeChange: [
      // Tiny blurred preview shown while the full photograph loads (progressive loading).
      async ({ data, req }) => {
        const file = req.file
        if (file?.data && file.mimetype?.startsWith('image/') && !file.mimetype.includes('svg')) {
          try {
            const buf = await sharp(file.data).resize(24, 24, { fit: 'inside' }).webp({ quality: 40 }).toBuffer()
            data.blurDataURL = `data:image/webp;base64,${buf.toString('base64')}`
          } catch {
            /* ignore */
          }
        }
        return data
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumb',
    // Very large camera files are scaled down and re-compressed on upload.
    resizeOptions: { width: 3200, height: 3200, fit: 'inside', withoutEnlargement: true },
    formatOptions: webp(86),
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: webp(78) },
      { name: 'medium', width: 1080, formatOptions: webp(82) },
      { name: 'large', width: 1920, formatOptions: webp(84) },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers and Google, e.g. "Bride and groom walking in Djurgården at sunset".',
      },
    },
    { name: 'title', type: 'text' },
    { name: 'caption', type: 'textarea', admin: { description: 'Optional caption shown under the image on the website.' } },
    { name: 'description', type: 'textarea', admin: { description: 'Internal notes / longer description.' } },
    { name: 'blurDataURL', type: 'text', admin: { hidden: true } },
  ],
}
