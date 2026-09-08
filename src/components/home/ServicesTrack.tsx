'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './ServicesPreview.module.css'

type Props = {
  children: React.ReactNode
  label: string
}

/**
 * Лента сервисов со своей полосой прокрутки.
 *
 * Нативная полоса здесь не годится принципиально. Она рисуется по нижнему
 * краю контейнера прокрутки, а этот контейнер намеренно вынесен за правый
 * край окна — значит и полоса уезжает за экран, и её правый конец мышью
 * не достать. Развести их нельзя: у элемента с overflow полоса всегда его
 * собственная.
 *
 * Поэтому полоса своя, отдельным элементом по ширине контейнера, а
 * нативная спрятана. Заодно она красится в цвета сайта без плясок вокруг
 * ::-webkit-scrollbar и scrollbar-color, которые в разных браузерах
 * поддержаны по-разному.
 *
 * Компонент клиентский, но тонкий: карточки приходят детьми со страницы,
 * в базу он не ходит и о сервисах ничего не знает.
 */
export default function ServicesTrack({ children, label }: Props) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [thumb, setThumb] = useState<{ width: number; left: number } | null>(null)

  /* Ширина бегунка — доля видимого в общем, положение — доля прокрученного
     в оставшемся. Обе в процентах, поэтому пересчитывать при изменении
     размеров окна не нужно, CSS сам всё пересчитает */
  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    if (max <= 1) {
      setThumb(null)
      return
    }

    const width = el.clientWidth / el.scrollWidth
    const left = (el.scrollLeft / max) * (1 - width)
    setThumb({ width: width * 100, left: left * 100 })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    sync()
    el.addEventListener('scroll', sync, { passive: true })

    /* ResizeObserver, а не resize у окна: ширина ленты меняется и от
       ширины окна, и от появления полосы прокрутки страницы, и от
       раскрытия соседних блоков */
    const observer = new ResizeObserver(sync)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const bar = event.currentTarget
    const el = trackRef.current
    if (!el) return

    const rect = bar.getBoundingClientRect()
    const max = el.scrollWidth - el.clientWidth
    const visible = el.clientWidth / el.scrollWidth
    const available = 1 - visible
    if (available <= 0) return

    /* Курсор задаёт середину бегунка, а не его левый край: иначе при
       клике по дорожке лента прыгает мимо того места, куда целились */
    const moveTo = (clientX: number) => {
      const point = (clientX - rect.left) / rect.width
      const left = Math.min(Math.max(point - visible / 2, 0), available)
      el.scrollLeft = (left / available) * max
    }

    bar.setPointerCapture(event.pointerId)
    moveTo(event.clientX)

    const onMove = (moveEvent: PointerEvent) => moveTo(moveEvent.clientX)
    const onUp = () => {
      bar.removeEventListener('pointermove', onMove)
      bar.removeEventListener('pointerup', onUp)
      bar.removeEventListener('pointercancel', onUp)
    }

    bar.addEventListener('pointermove', onMove)
    bar.addEventListener('pointerup', onUp)
    bar.addEventListener('pointercancel', onUp)
  }

  return (
    <>
      <ul className={styles.track} ref={trackRef}>
        {children}
      </ul>

      {/* Полоса — управление мышью, не источник информации: с клавиатуры
          лента листается фокусом по кнопкам карточек, скринридер читает
          список. Поэтому aria-hidden, чтобы не плодить пустой элемент
          в дереве доступности */}
      {thumb && (
        <div
          className={styles.bar}
          onPointerDown={startDrag}
          aria-hidden="true"
          data-label={label}
        >
          <div
            className={styles.thumb}
            style={{ width: `${thumb.width}%`, insetInlineStart: `${thumb.left}%` }}
          />
        </div>
      )}
    </>
  )
}
