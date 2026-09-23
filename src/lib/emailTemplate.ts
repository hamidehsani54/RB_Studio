/** Minimal, email-client-safe branded template (inline styles, table layout). */

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Replaces {name}, {date}, {service}, {package}, {siteName} placeholders. */
export const fillTemplate = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (m, key: string) => (key in values ? values[key] : m))

export function renderEmail({
  siteName,
  heading,
  message,
  details = [],
  footer,
  logoUrl,
}: {
  siteName: string
  heading: string
  message: string
  details?: [string, string | null | undefined][]
  footer?: string
  logoUrl?: string
}) {
  const paragraphs = message
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.7">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const rows = details
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 24px 8px 0;color:#8a8378;font-size:12px;letter-spacing:.12em;text-transform:uppercase;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;color:#171614">${esc(v).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#2b2926">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;padding:40px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fbf9f6;border:1px solid #e6e0d6">
<tr><td style="padding:36px 40px 8px;text-align:center">
${logoUrl ? `<img src="${esc(logoUrl)}" width="64" height="64" alt="${esc(siteName)}" style="border-radius:50%;display:inline-block">` : ''}
<div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:#8a8378;margin-top:14px">${esc(siteName)}</div>
</td></tr>
<tr><td style="padding:16px 40px 8px"><h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:30px;line-height:1.2;color:#171614">${esc(heading)}</h1>${paragraphs}</td></tr>
${rows ? `<tr><td style="padding:8px 40px 24px"><table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e0d6;width:100%;font-size:14px">${rows}</table></td></tr>` : ''}
<tr><td style="padding:20px 40px 32px;border-top:1px solid #e6e0d6;font-size:12px;color:#8a8378;text-align:center">${esc(footer ?? siteName)}</td></tr>
</table></td></tr></table></body></html>`
}

/** Default booking email texts (editable in Site settings → Contact → Booking emails). */
export const DEFAULT_EMAILS = {
  requestSubject: 'We received your booking request — {siteName}',
  requestMessage:
    'Hi {name},\n\nThank you for your booking request. {date} is now reserved for you while I look through the details.\n\nI personally reply to every request within two working days to confirm your booking.\n\nWarm regards,\n{siteName}',
  confirmedSubject: 'Your booking is confirmed — {siteName}',
  confirmedMessage:
    'Hi {name},\n\nWonderful news — your booking for {date} is confirmed. The date is now reserved exclusively for you.\n\nI will be in touch soon with the next steps. Just reply to this email if you have any questions.\n\nWarm regards,\n{siteName}',
}
