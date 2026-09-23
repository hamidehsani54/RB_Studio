import React from 'react'

/** Shown under the admin login form: a clear way back to the public website. */
export const BackToSite = () => (
  <div style={{ marginTop: 28, textAlign: 'center' }}>
    <a
      href="/"
      style={{
        fontSize: 13,
        letterSpacing: '0.08em',
        textDecoration: 'none',
        color: 'var(--theme-elevation-800)',
        borderBottom: '1px solid var(--theme-elevation-300)',
        paddingBottom: 2,
      }}
    >
      ← Back to website
    </a>
  </div>
)
