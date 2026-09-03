import Link from 'next/link'
import styles from './CtaBanner.module.css'

type Props = {
  title: string
  text: string
  buttonLabel: string
  buttonHref: string
}

/**
 * Синий блок-перелинковка внизу страницы. Навигация, а не форма заявки —
 * поэтому обычная ссылка, а не RequestButton.
 */
export default function CtaBanner({ title, text, buttonLabel, buttonHref }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
        <Link className={styles.button} href={buttonHref}>
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
