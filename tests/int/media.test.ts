import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import { createImage, getTestPayload } from '../helpers/payload'

let payload: Payload
const mediaDir = path.resolve('media')

beforeAll(async () => {
  payload = await getTestPayload()
})

describe('media library & image optimisation', () => {
  it('converts uploads to WebP and generates responsive sizes, an OG image and a blur preview', async () => {
    const doc = await createImage(payload, 2000, 1333, 'sizes')
    try {
      expect(doc.mimeType).toBe('image/webp')
      expect(doc.filename).toMatch(/\.webp$/)
      expect(doc.width).toBe(2000)
      expect(doc.sizes?.thumb?.width).toBe(480)
      expect(doc.sizes?.medium?.width).toBe(1080)
      expect(doc.sizes?.large?.width).toBe(1920)
      expect(doc.sizes?.og).toMatchObject({ width: 1200, height: 630, mimeType: 'image/jpeg' })
      expect(doc.blurDataURL).toMatch(/^data:image\/webp;base64,/)
      expect(doc.blurDataURL!.length).toBeLessThan(1500) // tiny inline placeholder
      expect(fs.existsSync(path.join(mediaDir, doc.filename!))).toBe(true)
    } finally {
      await payload.delete({ collection: 'media', id: doc.id })
    }
  })

  it('scales very large camera files down to max 3200px', async () => {
    const doc = await createImage(payload, 5000, 3333, 'huge')
    try {
      expect(doc.width).toBe(3200)
      expect(doc.height).toBe(2133)
    } finally {
      await payload.delete({ collection: 'media', id: doc.id })
    }
  })

  it('never enlarges small images', async () => {
    const doc = await createImage(payload, 600, 400, 'small')
    try {
      expect(doc.width).toBe(600)
      expect(doc.sizes?.large?.url ?? null).toBeNull()
    } finally {
      await payload.delete({ collection: 'media', id: doc.id })
    }
  })

  it('requires alt text (accessibility & SEO)', async () => {
    const sharp = (await import('sharp')).default
    const data = await sharp({ create: { width: 10, height: 10, channels: 3, background: '#000' } }).jpeg().toBuffer()
    await expect(
      payload.create({
        collection: 'media',
        data: {} as never,
        file: { data, mimetype: 'image/jpeg', name: 'no-alt.jpg', size: data.length },
      }),
    ).rejects.toThrow()
  })

  it('removes the files from disk when an image is deleted', async () => {
    const doc = await createImage(payload, 1200, 800, 'delete')
    const files = [doc.filename, ...Object.values(doc.sizes ?? {}).map((s) => s?.filename)].filter(Boolean) as string[]
    files.forEach((f) => expect(fs.existsSync(path.join(mediaDir, f))).toBe(true))
    await payload.delete({ collection: 'media', id: doc.id })
    files.forEach((f) => expect(fs.existsSync(path.join(mediaDir, f))).toBe(false))
  })
})
