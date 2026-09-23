import type { CollectionConfig } from 'payload'
import { adminsOnly, adminsOnlyField, loggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 hour sessions
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    forgotPassword: {
      generateEmailSubject: () => 'Reset your RB Studio admin password',
    },
  },
  access: {
    read: loggedIn,
    create: adminsOnly,
    delete: adminsOnly,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator (everything, incl. users & settings)', value: 'admin' },
        { label: 'Editor (content, portfolio, inquiries)', value: 'editor' },
      ],
      saveToJWT: true,
      access: { update: adminsOnlyField, create: adminsOnlyField },
    },
  ],
}
