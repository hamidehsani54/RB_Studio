import React from 'react'

const link: React.CSSProperties = {
  display: 'block',
  padding: '6px 0',
  textDecoration: 'none',
  color: 'var(--theme-elevation-800)',
  fontSize: 14,
}

export const NavLinks = () => (
  <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--theme-elevation-100)' }}>
    <a href="/admin/availability-calendar" style={link}>
      📅 Availability calendar
    </a>
    <a href="/admin/collections/inquiries?where[status][equals]=new" style={link}>
      ✉️ New inquiries
    </a>
    <a href="/" target="_blank" rel="noreferrer" style={link}>
      ↗ View website
    </a>
  </div>
)
