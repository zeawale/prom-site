import styles from './PageHero.module.css'

export type PageHeroProps = {
  title: string
  lead?: string | null
  /**
   * Уровень заголовка. Обычно это h1 страницы: /fresh, /grm, /its и
   * страницы программ (шапка раздела «Программы 1С» там — абзац).
   * Два h1 на странице ломают навигацию по заголовкам в скринридере.
   */
  level?: 1 | 2
}

export default function PageHero({ title, lead, level = 1 }: PageHeroProps) {
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <header className={styles.hero}>
      <Heading className={styles.title}>{title}</Heading>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  )
}
