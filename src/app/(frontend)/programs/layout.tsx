import Link from 'next/link'
import { getPrograms, getProgramsSection } from '@/lib/queries'
import ProgramTabs from '@/components/product/ProgramTabs'
import styles from './layout.module.css'

/**
 * Шапка раздела: одинакова на всех семи страницах.
 *
 * <main> живёт здесь, а не в страницах. Отступление от общего правила
 * осознанное: layout привязан к сегменту /programs и всегда стоит ровно над
 * своими страницами, вложенных <main> возникнуть не может. Зато H1 раздела
 * оказывается внутри <main>, а не до него.
 */
export default async function ProgramsLayout({ children }: { children: React.ReactNode }) {
  const [programs, section] = await Promise.all([getPrograms(), getProgramsSection()])

  // Порядок задан полем order, сортировка уже в запросе
  const tabs = programs.map(({ slug, tabLabel }) => ({ slug, label: tabLabel }))

  const banner = section.cloudBanner

  return (
    <main className="container">
      <header className={styles.hero}>
        <h1 className={styles.title}>{section.title}</h1>
        <p className={styles.lead}>{section.lead}</p>
      </header>

      {/* Крестика закрытия нет намеренно: баннер ничего не перекрывает,
          а закрывашка тянет за собой состояние и мигание при гидратации */}
      <aside className={styles.banner}>
        <h2 className={styles.bannerTitle}>{banner?.title}</h2>
        <p className={styles.bannerText}>{banner?.text}</p>
        <div className={styles.bannerButtons}>
          {(banner?.buttons ?? []).map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className={styles.bannerButton}
              data-style={button.style ?? 'primary'}
            >
              {button.label}
            </Link>
          ))}
        </div>
      </aside>

      <ProgramTabs tabs={tabs} />

      {children}
    </main>
  )
}
