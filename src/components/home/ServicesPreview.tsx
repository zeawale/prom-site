import Link from 'next/link'
import type { Service } from '@/payload-types'
import HomeServiceCard from './HomeServiceCard'
import ServicesTrack from './ServicesTrack'
import styles from './ServicesPreview.module.css'

type Props = {
  title: string
  buttonLabel?: string | null
  allLabel?: string | null
  services: Service[]
}

/**
 * «Сервисы 1С» — карточки каталога с флагом «Популярное», лентой с
 * горизонтальной прокруткой.
 *
 * Секция серверная, клиентские только карточка и лента: заголовок и
 * ссылка на каталог в гидратации не нуждаются.
 *
 * Кликается вся шапка блока целиком, а не одна стрелка: попасть в иконку
 * 28×28 заметно труднее, чем в строку с заголовком. <a> по спецификации
 * прозрачен для содержимого, поэтому h2 внутри него — валидная разметка.
 */
export default function ServicesPreview({ title, buttonLabel, allLabel, services }: Props) {
  if (!services.length) return null

  return (
    <section className={styles.section} aria-labelledby="home-services">
      <Link href="/services" className={styles.head}>
        <h2 className={styles.title} id="home-services">
          {title}
        </h2>

        <span className={styles.srOnly}>{allLabel ?? 'Все сервисы'}</span>

        {/* Стрелка нарисована svg, а не символом →: U+2192 не входит ни в
            один подключённый сабсет Montserrat и отрисовался бы системным
            шрифтом — тот же случай, что со стрелкой в CompareBlock */}
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

      <ServicesTrack label={title}>
        {services.map((service) => (
          <HomeServiceCard
            key={service.id}
            service={service}
            buttonLabel={buttonLabel ?? 'Подробнее'}
          />
        ))}
      </ServicesTrack>
    </section>
  )
}
