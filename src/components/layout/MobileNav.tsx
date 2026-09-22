'use client'

import { useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent } from 'react'
import { mainNav } from '@/lib/navigation'
import { NavLink } from './NavLink'
import { RequestButton } from './RequestButton'
import styles from './MobileNav.module.css'

/**
 * Бургер-меню шапки на узких экранах. На широких скрыт CSS-ом, а
 * десктопное меню в Header.tsx — наоборот.
 *
 * Паттерн — раскрывашка (disclosure), а не модалка: кнопка с
 * aria-expanded и панель под шапкой. Ловушки фокуса нет намеренно —
 * вместо неё меню закрывается, когда фокус уходит за его пределы. Для
 * навигации это честнее: посетитель с клавиатуры не застревает в меню,
 * а панель не висит открытой поверх страницы, по которой он уже ходит.
 *
 * Закрытие при переходе — по клику внутри панели, а не эффектом на
 * смену pathname: setState в теле эффекта ловит правило
 * react-hooks/set-state-in-effect, и это не стиль, а лишний рендер.
 * Клик по ссылке и по «Оставить заявку» — одно и то же событие,
 * поэтому обработчик один, на панели целиком.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  /* Эффект только на побочные действия, состояние в нём не меняется:
     блокировка прокрутки под панелью и Esc. Прежнее значение overflow
     восстанавливается — так же сделано в LeadModal */
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onPanelClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('a, button')) setOpen(false)
  }

  /* relatedTarget — куда ушёл фокус. null бывает при клике в пустое
     место страницы, это тоже «ушёл» */
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (!next || !event.currentTarget.contains(next)) setOpen(false)
  }

  return (
    <div className={styles.root} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.bars} data-open={open || undefined} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Условный рендер, а не visibility: закрытое меню не должно
          попадать ни в обход табом, ни в дерево доступности */}
      {open && (
        <div className={styles.panel} id={panelId} onClick={onPanelClick}>
          <nav aria-label="Основное меню">
            <ul className={styles.list}>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className={styles.link}
                    activeClassName={styles.linkActive}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <RequestButton className={styles.cta} source="header" />
        </div>
      )}
    </div>
  )
}
