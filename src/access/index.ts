import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const adminsOnly: Access = ({ req: { user } }) => user?.role === 'admin'

export const loggedInField: FieldAccess = ({ req: { user } }) => Boolean(user)

export const adminsOnlyField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

/** Public visitors only see published documents; logged-in editors see drafts too. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
