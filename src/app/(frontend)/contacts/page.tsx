import type { Metadata } from 'next'
import { getContacts, getCookieBanner, getSettings } from '@/lib/queries'
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
    description: contacts.lead,
  }
}

export default async function ContactsPage() {
  /* Версия согласия нужна карте: разрешение, данное на прежний состав
     категорий, к новому не относится */
  const [contacts, settings, cookie] = await Promise.all([
    getContacts(),
    getSettings(),
    getCookieBanner(),
  ])

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
      {/* Заполненность глобала гарантирует getContacts — см. assertFilled
          в lib/queries. Здесь обязательные поля берутся как есть */}
      <PageHero title={contacts.title} lead={contacts.lead} level={1} />

      <ContactCards items={cards} />

      {contacts.map?.url && (
        <OfficeMap
          url={contacts.map.url}
          plaque={contacts.map.plaque}
          buttonLabel={contacts.map.buttonLabel}
          note={contacts.map.note}
          address={settings.address}
          consentVersion={cookie.version}
        />
      )}
    </main>
  )
}
