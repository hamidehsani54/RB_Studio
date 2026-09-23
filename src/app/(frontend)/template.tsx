import React from 'react'

/** Re-mounts on every navigation, giving each page a soft fade-in transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>
}
