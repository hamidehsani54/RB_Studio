/* eslint-disable @next/next/no-img-element */
import React from 'react'

/** Logo on the login / forgot-password screens — links back to the website. */
export const Logo = () => (
  <a
    href="/"
    title="Back to the website"
    style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'inherit', textDecoration: 'none' }}
  >
    <img src="/brand/rb-studio-logo.png" alt="RB Studio" width={72} height={72} style={{ borderRadius: '50%' }} />
    <div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, letterSpacing: '0.02em' }}>RB Studio</div>
      <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>Website admin</div>
    </div>
  </a>
)

export const Icon = () => (
  <img src="/brand/rb-studio-logo.png" alt="RB Studio" width={28} height={28} style={{ borderRadius: '50%' }} />
)
