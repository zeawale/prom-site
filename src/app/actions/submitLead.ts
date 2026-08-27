'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CONSENT_VERSION } from '@/lib/consent'
import type { LeadResult } from '@/lib/leads'


export async function submitLead(formData: FormData): Promise<LeadResult> {
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const comment = String(formData.get('comment') ?? '').trim()
  const consent = formData.get('consent') === 'on'
  const page = String(formData.get('page') ?? '').trim() || 'unknown'

  const fieldErrors: Record<string, string> = {}

  if (name.length < 2) {
    fieldErrors.name = 'Укажите имя'
  }

  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 11) {
    fieldErrors.phone = 'Укажите телефон в формате +7 (999) 123-45-67'
  }

  if (!email) {
    fieldErrors.email = 'Укажите адрес почты'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Проверьте адрес почты'
  }

  if (comment.length > 2000) {
    fieldErrors.comment = 'Комментарий слишком длинный'
  }

  if (!consent) {
    fieldErrors.consent = 'Без согласия мы не сможем принять заявку'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Проверьте заполнение полей', fieldErrors }
  }

  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || ''

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      data: {
        name,
        phone,
        email: email,
        comment: comment || undefined,
        status: 'new',
        page,
        consentAt: new Date().toISOString(),
        consentIp: ip,
        consentVersion: CONSENT_VERSION,
      },
    })

    return { ok: true }
  } catch (err) {
    console.error('[submitLead]', err)
    return {
      ok: false,
      error: 'Не удалось отправить заявку. Позвоните нам: +7 (831) 282-31-99',
    }
  }
}