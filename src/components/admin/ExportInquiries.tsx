'use client'
import React from 'react'

/** "Export CSV" button above the inquiries list — respects the current filters and search. */
export const ExportInquiries = () => {
  const exportCsv = () => {
    const params = new URLSearchParams(window.location.search)
    const out = new URLSearchParams()
    params.forEach((value, key) => {
      if (key.startsWith('where')) out.append(key, value)
    })
    const search = params.get('search')
    if (search) {
      out.append('where[and][99][or][0][name][like]', search)
      out.append('where[and][99][or][1][email][like]', search)
    }
    const qs = out.toString()
    window.location.href = `/api/inquiries/export${qs ? `?${qs}` : ''}`
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
      <button type="button" className="btn btn--style-secondary btn--size-small" onClick={exportCsv} style={{ margin: 0 }}>
        Export CSV
      </button>
    </div>
  )
}
