import Link from 'next/link'
import type { Service } from '@/payload-types'
import HomeServiceCard from './HomeServiceCard'
import styles from './ServicesPreview.module.css'

type Props = {
  title: string
  buttonLabel?: string | null
  allLabel?: string | null
  services: Service[]
}

/**
 * «Сервисы 1С» — три карточки каталога с флагом «Популярное».
 *
 * Секция серверная, клиентская только сама карточка: заголовок и стрелка
 * на каталог в гидратации не нуждаются.
 */
export default function ServicesPreview({ title, buttonLabel, allLabel, services }: Props) {
  if (!services.length) return null

  return (
    <section aria-labelledby="home-services">
      <div className={styles.head}>
        <h2 className={styles.title} id="home-services">
          {title}
        </h2>

        {/* Стрелка нарисована svg, а не символом →: U+2192 не входит ни в
            один подключённый сабсет Montserrat и отрисовался бы системным
            шрифтом — тот же случай, что со стрелкой в CompareBlock */}
        <Link href="/services" className={styles.all}>
          <span className={styles.srOnly}>{allLabel ?? 'Все сервисы'}</span>
          <svg
            className={styles.arrow}
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <ul className={styles.grid}>
        {services.map((service) => (
          <HomeServiceCard
            key={service.id}
            service={service}
            buttonLabel={buttonLabel ?? 'Подробнее'}
          />
        ))}
      </ul>
    </section>
  )
}
