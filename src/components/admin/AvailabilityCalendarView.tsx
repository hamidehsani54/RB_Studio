import React from 'react'
import { redirect } from 'next/navigation'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { AvailabilityCalendar } from './AvailabilityCalendar'

export const AvailabilityCalendarView = ({ initPageResult, params, searchParams }: AdminViewServerProps) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=/admin/availability-calendar')

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, margin: '32px 0 4px' }}>Availability calendar</h1>
        <p style={{ opacity: 0.65, marginTop: 0 }}>
          Click a day to mark it as booked, tentative or available and add a private note. Visitors only see the status —
          never your notes.
        </p>
        <AvailabilityCalendar />
      </Gutter>
    </DefaultTemplate>
  )
}
