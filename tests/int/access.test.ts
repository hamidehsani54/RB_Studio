import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import type { Media, User } from '@/payload-types'
import { createImage, ensureUser, getTestPayload, unique } from '../helpers/payload'

let payload: Payload
let admin: User
let editor: User
let image: Media

beforeAll(async () => {
  payload = await getTestPayload()
  admin = await ensureUser(payload, 'admin')
  editor = await ensureUser(payload, 'editor')
  image = await createImage(payload, 1200, 800, 'access')
})

afterAll(async () => {
  await payload.delete({ collection: 'media', id: image.id })
})

describe('anonymous visitors (public website / API)', () => {
  it('cannot read or create inquiries through the API', async () => {
    await expect(payload.find({ collection: 'inquiries', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({ collection: 'inquiries', data: { name: 'Spam', email: 'spam@x.com', status: 'new' }, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('cannot create or change website content', async () => {
    await expect(payload.create({ collection: 'faqs', data: { question: 'Q', answer: 'A' }, overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({ collection: 'packages', data: { name: 'Hack', price: '1 SEK' }, overrideAccess: false }),
    ).rejects.toThrow()
    await expect(
      payload.updateGlobal({ slug: 'site-settings', data: { siteName: 'Hacked' }, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('cannot list admin users', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('can read public content such as services and FAQ', async () => {
    await payload.create({ collection: 'faqs', data: { question: 'Public?', answer: 'Yes' } })
    const res = await payload.find({ collection: 'faqs', overrideAccess: false })
    expect(res.totalDocs).toBeGreaterThan(0)
  })

  it('never sees private availability notes, but editors do', async () => {
    const entry = await payload.create({
      collection: 'availability',
      data: { date: '2031-03-01T12:00:00.000Z', status: 'booked', note: 'Client: secret name, deposit paid' },
    })
    const publicView = await payload.findByID({ collection: 'availability', id: entry.id, overrideAccess: false })
    expect(publicView.status).toBe('booked')
    expect(publicView.note).toBeUndefined()

    const editorView = await payload.findByID({ collection: 'availability', id: entry.id, overrideAccess: false, user: editor })
    expect(editorView.note).toBe('Client: secret name, deposit paid')
  })

  it('does not see unpublished drafts, which become visible once published', async () => {
    const slug = unique('draft-story')
    const draft = await payload.create({
      collection: 'projects',
      data: { title: 'Secret draft', slug, cover: image.id, _status: 'draft' },
      draft: true,
    })
    const hidden = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, overrideAccess: false })
    expect(hidden.totalDocs).toBe(0)

    const asEditor = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      overrideAccess: false,
      user: editor,
      draft: true,
    })
    expect(asEditor.totalDocs).toBe(1)

    await payload.update({ collection: 'projects', id: draft.id, data: { _status: 'published' } })
    const visible = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, overrideAccess: false })
    expect(visible.totalDocs).toBe(1)
  })
})

describe('admin roles', () => {
  it('editors can read inquiries and edit content', async () => {
    const res = await payload.find({ collection: 'inquiries', overrideAccess: false, user: editor })
    expect(res).toHaveProperty('docs')
    const faq = await payload.create({ collection: 'faqs', data: { question: 'By editor', answer: 'OK' }, overrideAccess: false, user: editor })
    expect(faq.question).toBe('By editor')
  })

  it('editors cannot create users or promote themselves', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { name: 'x', email: 'x@test.local', password: 'password-123', role: 'admin' },
        overrideAccess: false,
        user: editor,
      }),
    ).rejects.toThrow()

    await payload.update({ collection: 'users', id: editor.id, data: { role: 'admin' }, overrideAccess: false, user: editor })
    const after = await payload.findByID({ collection: 'users', id: editor.id })
    expect(after.role).toBe('editor')
  })

  it('editors cannot edit other users', async () => {
    await expect(
      payload.update({ collection: 'users', id: admin.id, data: { name: 'Changed' }, overrideAccess: false, user: editor }),
    ).rejects.toThrow()
  })

  it('administrators can create users', async () => {
    const u = await payload.create({
      collection: 'users',
      data: { name: 'New', email: `${unique('new')}@test.local`, password: 'password-123', role: 'editor' },
      overrideAccess: false,
      user: admin,
    })
    expect(u.role).toBe('editor')
  })
})

describe('login security', () => {
  it('accepts the right password and rejects a wrong one', async () => {
    const ok = await payload.login({ collection: 'users', data: { email: 'admin@test.local', password: 'test-password-123' } })
    expect(ok.token).toBeTruthy()
    await expect(
      payload.login({ collection: 'users', data: { email: 'admin@test.local', password: 'wrong-password' } }),
    ).rejects.toThrow()
  })

  it('locks an account after 5 failed attempts', async () => {
    const email = `${unique('lock')}@test.local`
    await payload.create({ collection: 'users', data: { name: 'Lock', email, password: 'right-password-1', role: 'editor' } })
    for (let i = 0; i < 5; i++) {
      await payload.login({ collection: 'users', data: { email, password: 'nope' } }).catch(() => null)
    }
    await expect(payload.login({ collection: 'users', data: { email, password: 'right-password-1' } })).rejects.toThrow(/locked/i)
  })

  it('issues a password-reset token (forgot password flow)', async () => {
    const token = await payload.forgotPassword({ collection: 'users', data: { email: 'admin@test.local' }, disableEmail: true })
    expect(typeof token).toBe('string')
    expect(token!.length).toBeGreaterThan(10)
  })
})
