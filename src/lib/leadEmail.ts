import type { CollectionAfterChangeHook } from 'payload'
import type { Lead } from '@/payload-types'
import { SITE_URL } from './site'

/**
 * Письмо о новой заявке на почту консультанта (LEADS_NOTIFY_TO).
 *
 * Хук, а не вызов в submitLead: так письмо уходит при любом создании
 * заявки, кроме ручного из админки (req.user есть — человек и так в
 * курсе).
 *
 * Ошибка отправки заявку не роняет: она уже лежит в Leads, и посетитель
 * должен увидеть «отправлено», а не просьбу позвонить. Ошибка уходит в
 * лог сервера.
 *
 * Адреса на example.com пропускаются: это зарезервированный домен, им
 * пользуется e2e-тест формы. Иначе каждый прогон тестов на машине с
 * настроенным SMTP слал бы письмо в рабочий ящик.
 */
export const notifyNewLead: CollectionAfterChangeHook<Lead> = async ({ doc, operation, req }) => {
  if (operation !== 'create' || req.user) return doc

  const to = process.env.LEADS_NOTIFY_TO
  if (!to) return doc
  if (doc.email.toLowerCase().endsWith('@example.com')) return doc

  try {
    await req.payload.sendEmail({
      to,
      // Ответ из почтового клиента уйдёт клиенту, а не обратно в ящик сайта
      replyTo: doc.email,
      subject: `Заявка с сайта pm52.ru — ${oneLine(doc.name)}`,
      text: leadText(doc),
      html: leadHtml(doc),
    })
  } catch (err) {
    req.payload.logger.error({ err, leadId: doc.id }, '[notifyNewLead] письмо не отправлено')
  }

  return doc
}

function leadRows(doc: Lead): [string, string][] {
  const rows: [string, string][] = [
    ['Имя', doc.name],
    ['Телефон', doc.phone],
    ['E-mail', doc.email],
  ]
  if (doc.comment) rows.push(['Комментарий', doc.comment])
  rows.push(['Источник', doc.page ?? '—'])
  rows.push(['Получена', formatDate(doc.createdAt)])
  return rows
}

function adminUrl(doc: Lead) {
  return `${SITE_URL}/admin/collections/leads/${doc.id}`
}

function leadText(doc: Lead) {
  const rows = leadRows(doc).map(([k, v]) => `${k}: ${v}`)
  return ['Новая заявка с сайта.', '', ...rows, '', `Заявка в админке: ${adminUrl(doc)}`].join('\n')
}

function leadHtml(doc: Lead) {
  const rows = leadRows(doc)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${k}</td>` +
        `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return (
    `<p>Новая заявка с сайта.</p>` +
    `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>` +
    `<p><a href="${adminUrl(doc)}">Открыть заявку в админке</a></p>`
  )
}

/** Перевод строки в теме письма — это уже следующий заголовок */
function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, ' ').trim()
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'long',
    timeStyle: 'short',
  })
}
