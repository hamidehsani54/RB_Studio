import React from 'react'
import type { ContactBlock, Service } from '@/payload-types'
import { getAbout, getPackages, getServices, getSettings } from '@/lib/data'
import { asDoc, asMedia } from '@/lib/utils'
import { Img } from '../Img'
import { ContactForm } from './ContactForm'

export async function Contact({ block, isFirst }: { block: ContactBlock; isFirst: boolean }) {
  const [settings, about, services, packages] = await Promise.all([getSettings(), getAbout(), getServices(), getPackages()])
  const image = asMedia(block.image)
  const H = isFirst ? 'h1' : 'h2'
  const location = about.location || [settings.city, settings.country].filter(Boolean).join(', ')

  return (
    <section id={block.anchor || 'contact'} className="contact" data-header-overlay={isFirst && image ? '' : undefined}>
      <div className="contact__aside">
        {image && (
          <div className="contact__aside-bg">
            <Img media={image} sizes="(min-width: 1000px) 42vw, 100vw" priority={isFirst} />
          </div>
        )}
        {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
        <H className="h2">{block.heading}</H>
        {block.text && <p className="section-head__text">{block.text}</p>}
        {block.showDetails && (
          <ul className="contact-details">
            {settings.email && (
              <li>
                <span className="label">Email</span>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings.phone && (
              <li>
                <span className="label">Phone</span>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
              </li>
            )}
            {location && (
              <li>
                <span className="label">Based in</span>
                {location}
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="contact__form">
        <ContactForm
          intro={settings.formIntro}
          services={services.map((s) => ({ value: s.slug || String(s.id), label: s.title }))}
          packages={packages.map((p) => ({
            value: p.slug || String(p.id),
            label: p.name,
            service: asDoc<Service>(p.service)?.title,
          }))}
          budgetOptions={(settings.budgetOptions ?? []).map((b) => b.label)}
          hoursOptions={(settings.hoursOptions ?? []).map((b) => b.label)}
          consentText={settings.consentText || 'I agree that my details are stored to answer my inquiry.'}
          privacyUrl="/privacy-policy"
          successHeading={settings.successHeading || 'Thank you.'}
          successMessage={settings.successMessage || 'Your message has arrived.'}
        />
      </div>
    </section>
  )
}
