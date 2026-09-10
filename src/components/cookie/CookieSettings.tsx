'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CookieTexts } from './CookieConsent'
import styles from './CookieConsent.module.css'

type Props = {
  texts: CookieTexts['settings']
  onSave: (analytics: boolean, functional: boolean) => void
  onClose: () => void
}

type ToggleProps = {
  checked: boolean
  labelledBy: string
  /** Необходимые cookie выключить нельзя — переключатель только показывает состояние */
  locked?: boolean
  onChange?: (next: boolean) => void
}

/**
 * Переключатель категории.
 *
 * role="switch" на кнопке, а не чекбокс с картинкой поверх: скринридер
 * объявляет «переключатель, включён», а не «флажок», и это ровно то, чем
 * элемент является. Пробел и Enter работают сами, потому что это button.
 */
function Toggle({ checked, labelledBy, locked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-disabled={locked || undefined}
      className={styles.switch}
      data-on={checked || undefined}
      data-locked={locked || undefined}
      onClick={() => !locked && onChange?.(!checked)}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  )
}

/**
 * Модалка «Настройки cookie».
 *
 * Черновик выбора живёт здесь и уезжает в хранилище только по «Сохранить
 * выбор» или «Принять все»: пощёлкать переключателями и закрыть крестиком
 * не должно ничего менять.
 *
 * Обвязка модалки повторяет LeadModal — ловушка фокуса по Tab, Esc,
 * закрытие по фону через onMouseDown (а не onClick: иначе выделение
 * текста, начатое внутри и отпущенное на фоне, закрывало бы окно),
 * блокировка прокрутки страницы с восстановлением прежнего значения.
 */
export function CookieSettings({ texts, onSave, onClose }: Props) {
  /* Обе категории выключены по умолчанию — согласие бывает только явным */
  const [analytics, setAnalytics] = useState(false)
  const [functional, setFunctional] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const baseId = useId()

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href]',
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

  const rows = [
    {
      key: 'necessary',
      ...texts.necessary,
      checked: true,
      locked: true,
      onChange: undefined,
    },
    {
      key: 'analytics',
      ...texts.analytics,
      checked: analytics,
      locked: false,
      onChange: setAnalytics,
    },
    {
      key: 'functional',
      ...texts.functional,
      checked: functional,
      locked: false,
      onChange: setFunctional,
    },
  ]

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть настройки"
        >
          ✕
        </button>

        <h2 className={styles.dialogTitle} id={`${baseId}-title`}>
          {texts.title}
        </h2>

        <ul className={styles.list}>
          {rows.map((row) => (
            <li key={row.key} className={styles.row}>
              <div className={styles.rowText}>
                <p className={styles.rowLabel} id={`${baseId}-${row.key}`}>
                  {row.label}
                </p>
                <p className={styles.rowDesc}>{row.text}</p>
              </div>

              <Toggle
                checked={row.checked}
                locked={row.locked}
                labelledBy={`${baseId}-${row.key}`}
                onChange={row.onChange}
              />
            </li>
          ))}
        </ul>

        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.accept}
            onClick={() => onSave(analytics, functional)}
          >
            {texts.saveLabel}
          </button>
          <button type="button" className={styles.reject} onClick={() => onSave(true, true)}>
            {texts.acceptAllLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
