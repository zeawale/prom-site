'use client'

import { useEffect, useRef, useState } from 'react'
import { submitLead } from '@/app/actions/submitLead'
import type { LeadResult } from '@/lib/leads'
import styles from './LeadModal.module.css'

type Props = {
  source: string
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'success'

export function LeadModal({ source, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  useEffect(() => {
    if (status === 'success') {
      closeButtonRef.current?.focus()
    }
  }, [status])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea, a[href]',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  async function handleSubmit(formData: FormData) {
    setStatus('sending')
    setError(null)
    setFieldErrors({})

    const result: LeadResult = await submitLead(formData)

    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('idle')
      setError(result.error)
      setFieldErrors(result.fieldErrors ?? {})
    }
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
          ref={status === 'success' ? closeButtonRef : undefined}
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className={styles.success}>
            <h2 id="lead-modal-title" className={styles.title}>
              Заявка отправлена
            </h2>
            <p className={styles.successText}>
              Мы свяжемся с вами в рабочее время: пн–пт, с 9:00 до 18:00.
            </p>
          </div>
        ) : (
          <>
            <h2 id="lead-modal-title" className={styles.title}>
              Нужна помощь с выбором или консультация?
            </h2>

            <form action={handleSubmit} className={styles.form} noValidate>
              <input type="hidden" name="page" value={source} />

              <div className={styles.field}>
                <label htmlFor="lead-name" className={styles.label}>
                  ФИО{' '}
                  <span className={styles.asterisk} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  ref={firstFieldRef}
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={styles.input}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'lead-name-error' : undefined}
                />
                {fieldErrors.name && (
                  <p id="lead-name-error" className={styles.fieldError}>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-phone" className={styles.label}>
                  Телефон{' '}
                  <span className={styles.asterisk} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+7 (999) 123-45-67"
                  className={styles.input}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'lead-phone-error' : undefined}
                />
                {fieldErrors.phone && (
                  <p id="lead-phone-error" className={styles.fieldError}>
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-email" className={styles.label}>
                  E-mail{' '}
                  <span className={styles.asterisk} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={styles.input}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'lead-email-error' : undefined}
                />
                {fieldErrors.email && (
                  <p id="lead-email-error" className={styles.fieldError}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-comment" className={styles.label}>
                  Комментарий
                </label>
                <textarea
                  id="lead-comment"
                  name="comment"
                  rows={4}
                  className={styles.textarea}
                  aria-invalid={Boolean(fieldErrors.comment)}
                  aria-describedby={fieldErrors.comment ? 'lead-comment-error' : undefined}
                />
                {fieldErrors.comment && (
                  <p id="lead-comment-error" className={styles.fieldError}>
                    {fieldErrors.comment}
                  </p>
                )}
              </div>

              <div className={styles.consent}>
                <input
                  id="lead-consent"
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className={styles.checkbox}
                  aria-describedby={fieldErrors.consent ? 'lead-consent-error' : undefined}
                />
                <label htmlFor="lead-consent" className={styles.consentLabel}>
                  Согласен на{' '}
                  <a href="/consent" target="_blank" rel="noreferrer">
                    обработку персональных данных
                  </a>
                </label>
              </div>
              {fieldErrors.consent && (
                <p id="lead-consent-error" className={styles.fieldError}>
                  {fieldErrors.consent}
                </p>
              )}

              {error && (
                <p className={styles.formError} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={!consent || status === 'sending'}
              >
                {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </button>
              <p className={styles.requiredNote}>
                <span className={styles.asterisk} aria-hidden="true">
                  *{' '}
                </span>
                обязательные поля для заполнения
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
