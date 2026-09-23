/** Helpers to build Lexical rich-text JSON for seed content. */

type Node = Record<string, unknown>

const text = (t: string, format = 0): Node => ({
  type: 'text',
  text: t,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

/** Supports **bold** and *italic* inline markers. */
const inline = (t: string): Node[] =>
  t
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('**')) return text(part.slice(2, -2), 1)
      if (part.startsWith('*')) return text(part.slice(1, -1), 2)
      return text(part)
    })

export const p = (t: string): Node => ({ type: 'paragraph', ...base, textFormat: 0, textStyle: '', children: inline(t) })
export const h = (tag: 'h2' | 'h3' | 'h4', t: string): Node => ({ type: 'heading', tag, ...base, children: inline(t) })
export const quote = (t: string): Node => ({ type: 'quote', ...base, children: inline(t) })
export const ul = (items: string[]): Node => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  ...base,
  children: items.map((it, i) => ({ type: 'listitem', value: i + 1, checked: undefined, ...base, children: inline(it) })),
})
export const upload = (id: number): Node => ({
  type: 'upload',
  version: 3,
  format: '',
  relationTo: 'media',
  value: id,
  fields: null,
  id: `u${id}${Math.random().toString(36).slice(2, 8)}`,
})
export const block = (fields: Record<string, unknown>): Node => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: Math.random().toString(36).slice(2, 14), blockName: '', ...fields },
})

export const doc = (...children: Node[]) => ({
  root: { type: 'root', ...base, children },
})

/** Plain paragraphs separated by blank lines → rich text. */
export const paragraphs = (s: string) =>
  doc(
    ...s
      .trim()
      .split(/\n\s*\n/)
      .map((x) => p(x.trim())),
  )
