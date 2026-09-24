import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '@/components/layout/NotFound.module.css'

/**
 * Страница 404 сайта.
 *
 * Срабатывает на notFound() из любой страницы группы (frontend) — несуществующий
 * слаг программы, категории, сервиса — и на любой адрес, не совпавший ни с
 * одним маршрутом: их ловит catch-all [...rest]/page.tsx и тоже зовёт
 * notFound(). Без catch-all Next для незнакомого адреса рисовал бы свою
 * английскую заглушку без шапки: у проекта два корневых layout (сайт и
 * админка), и общего not-found на уровне app у него нет.
 *
 * Тексты здесь, а не в CMS, сознательно: страница не контентная, редактор
 * сюда не полезет, а запрос в базу на каждый 404 — лишняя работа под
 * ботов, которые после переезда будут ходить по старым адресам.
 */
export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="container">
      <section className={styles.section}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.text}>
          Возможно, адрес изменился или страницу убрали при обновлении сайта. Если вы искали что-то
          конкретное — напишите нам через <Link href="/contacts">контакты</Link>, поможем.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            На главную
          </Link>
          <Link href="/services" className={styles.secondary}>
            Сервисы 1С
          </Link>
        </div>
      </section>
    </main>
  )
}
