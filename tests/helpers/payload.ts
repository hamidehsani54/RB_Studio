import sharp from 'sharp'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'

export const getTestPayload = () => getPayload({ config })

/** Finds or creates a user with the given role. */
export async function ensureUser(payload: Payload, role: 'admin' | 'editor'): Promise<User> {
  const email = `${role}@test.local`
  const found = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (found.docs[0]) return found.docs[0]
  return payload.create({ collection: 'users', data: { name: role, email, password: 'test-password-123', role } })
}

/** Uploads a generated JPEG of the given size to the media library. */
export async function createImage(payload: Payload, width = 1600, height = 1067, name = 'test') {
  const data = await sharp({ create: { width, height, channels: 3, background: { r: 180, g: 160, b: 140 } } })
    .jpeg()
    .toBuffer()
  return payload.create({
    collection: 'media',
    data: { alt: `Test image ${name}` },
    file: { data, mimetype: 'image/jpeg', name: `${name}-${Date.now()}.jpg`, size: data.length },
  })
}

export const unique = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`
