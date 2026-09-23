import React from 'react'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedBlockNode, SerializedUploadNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Frame, Img } from './Img'
import { asMedia, cx, embedUrl } from '@/lib/utils'

type GalleryFields = { images?: unknown[]; columns?: string }
type VideoFields = { url: string; caption?: string }

const internalDocToHref = ({ linkNode }: { linkNode: { fields: { doc?: unknown } } }) => {
  const doc = linkNode.fields.doc as { relationTo?: string; value?: { slug?: string } } | undefined
  const slug = doc?.value?.slug
  switch (doc?.relationTo) {
    case 'projects':
      return `/stories/${slug}`
    case 'services':
      return `/services/${slug}`
    case 'posts':
      return `/journal/${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return '/'
  }
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<GalleryFields & { blockType: 'gallery' }> | SerializedBlockNode<VideoFields & { blockType: 'video' }>

const converters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: internalDocToHref as never }),
  upload: ({ node }) => {
    const media = asMedia((node as SerializedUploadNode).value)
    if (!media) return null
    return (
      <figure>
        <Img media={media} fill={false} sizes="(min-width: 900px) 760px, 100vw" />
        {media.caption && <figcaption className="caption">{media.caption}</figcaption>}
      </figure>
    )
  },
  blocks: {
    gallery: ({ node }) => {
      const images = (node.fields.images ?? []).map(asMedia).filter(Boolean)
      return (
        <div className="prose-gallery" style={{ ['--cols' as string]: node.fields.columns ?? '2' }}>
          {images.map((m) => (
            <Frame key={m!.id} media={m} natural sizes="(min-width: 900px) 40vw, 100vw" />
          ))}
        </div>
      )
    },
    video: ({ node }) => {
      const src = embedUrl(node.fields.url)
      if (!src) return null
      return (
        <figure>
          <div className="video">
            <iframe
              src={src}
              title={node.fields.caption || 'Video'}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {node.fields.caption && <figcaption className="caption">{node.fields.caption}</figcaption>}
        </figure>
      )
    },
  },
})

export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={cx('prose', className)}
      disableContainer={false}
    />
  )
}
