import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1 className="display">This page wandered off.</h1>
        <p className="lede muted" style={{ marginTop: '2rem' }}>
          The link may be old, or the story has moved.
        </p>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" className="btn">
            Back to home
          </Link>
          <Link href="/portfolio" className="link">
            View portfolio <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
