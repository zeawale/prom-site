import styles from './PageHero.module.css'

export type PageHeroProps = {
  title: string
  lead?: string | null
  /**
   * Уровень заголовка. На /fresh, /grm, /its это единственный заголовок
   * страницы — h1. В разделе /programs h1 занят шапкой раздела
   * («Программы 1С»), поэтому название программы идёт h2.
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