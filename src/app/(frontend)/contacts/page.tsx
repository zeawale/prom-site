import type { Metadata } from 'next'
import { getContacts, getSettings } from '@/lib/queries'
import PageHero from '@/components/product/PageHero'
import ContactCards, { type ContactCard } from '@/components/contacts/ContactCards'
import OfficeMap from '@/components/contacts/OfficeMap'

// Своего layout нет — <main> и .container рендерит сама страница

export async function generateMetadata(): Promise<Metadata> {
  const contacts = await getContacts()
  return {
    title: contacts.title
      ? `${contacts.title} — ООО «НПП ПРО-М» в Нижнем Новгороде`
      : 'Контакты — ООО «НПП ПРО-М» в Нижнем Новгороде',
    description: contacts.lead ?? undefined,
  }
}

export default async function ContactsPage() {
  const [contacts, settings] = await Promise.all([getContacts(), getSettings()])

  /* Значения — из Settings, обёртки — из Contacts. Порядок карточек
     фиксирован здесь, а не в CMS: он совпадает с макетом, и давать
     админу переставлять реквизиты незачем */
  const cards: ContactCard[] = [
    {
      label: contacts.phone?.label ?? 'Телефон',
      value: settings.phone,
      caption: contacts.phone?.caption,
      href: `tel:${settings.phoneRaw ?? settings.phone}`,
    },
    {
      label: contacts.email?.label ?? 'Почта',
      value: settings.email,
      caption: contacts.email?.caption,
      href: `mailto:${settings.email}`,
    },
    {
      label: contacts.hours?.label ?? 'Часы работы',
      value: settings.workHours,
      caption: contacts.hours?.caption,
    },
    {
      label: contacts.address?.label ?? 'Адрес офиса',
      value: settings.address,
      caption: contacts.address?.caption,
    },
    {
      label: contacts.legal?.label ?? 'Юридическое лицо',
      value: settings.legalName,
      caption: contacts.legal?.caption,
    },
    {
      label: contacts.inn?.label ?? 'ИНН',
      value: settings.inn,
      caption: contacts.inn?.caption,
    },
  ]

  return (
    <main className="container">
      {/* ?? '' по той же причине, что на /about: пока глобал не сохранён,
          Payload отдаёт undefined даже для полей с required */}
      <PageHero title={contacts.title ?? ''} lead={contacts.lead} level={1} />

      <ContactCards items={cards} />

      {contacts.map?.url && (
        <OfficeMap
          url={contacts.map.url}
          plaque={contacts.map.plaque}
          buttonLabel={contacts.map.buttonLabel}
          note={contacts.map.note}
          address={settings.address}
        />
      )}
    </main>
  )
}
