import Link from 'next/link'
import React from 'react'
import { cx, isExternal } from '@/lib/utils'

export type SectionProps = {
  enabled?: boolean | null
  tone?: 'light' | 'sand' | 'dark' | null
  anchor?: string | null
}

export function Section({
  block,
  className,
  children,
  ...rest
}: {
  block: SectionProps
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={block.anchor || undefined} className={cx('section', `tone-${block.tone || 'light'}`, className)} {...rest}>
      {children}
    </section>
  )
}

export function SectionHead({
  eyebrow,
  heading,
  text,
  align = 'split',
  children,
  as: H = 'h2',
}: {
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
  align?: 'split' | 'center' | 'left'
  children?: React.ReactNode
  as?: 'h1' | 'h2'
}) {
  if (!eyebrow && !heading && !text && !children) return null
  return (
    <header className={cx('section-head', align === 'split' && 'section-head--split', align === 'center' && 'section-head--center')}>
      <div data-reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <H className="h2">{heading}</H>}
      </div>
      {(text || children) && (
        <div data-reveal style={{ ['--d' as string]: 1 }}>
          {text && <p className="section-head__text">{text}</p>}
          {children}
        </div>
      )}
    </header>
  )
}

export function CtaLink({
  link,
  className = 'link',
  arrow = true,
}: {
  link?: { label?: string | null; url?: string | null } | null
  className?: string
  arrow?: boolean
}) {
  if (!link?.label || !link.url) return null
  const content = (
    <>
      {link.label} {arrow && <span className="arrow" aria-hidden="true">→</span>}
    </>
  )
  if (isExternal(link.url))
    return (
      <a href={link.url} className={className} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  return (
    <Link href={link.url} className={className}>
      {content}
    </Link>
  )
}

/** Renders "Anna & *Erik*" style emphasis: text wrapped in *asterisks* becomes italic. */
export function Emphasis({ text }: { text?: string | null }) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) => (p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </>
  )
}
