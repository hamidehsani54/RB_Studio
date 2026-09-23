import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are statically rendered and cached. Any content change clears the cache
 * so the public website updates immediately after saving in the admin panel.
 */
const revalidateSite = (context: Record<string, unknown> | undefined) => {
  if (context?.disableRevalidate) return
  import('next/cache')
    .then(({ revalidatePath }) => revalidatePath('/', 'layout'))
    .catch(() => {
      /* not running inside Next.js (e.g. seed script) */
    })
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  try {
    revalidateSite(req.context)
  } catch {}
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  try {
    revalidateSite(req.context)
  } catch {}
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  try {
    revalidateSite(req.context)
  } catch {}
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
