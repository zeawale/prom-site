import { RequestButton } from '@/components/layout/RequestButton'
import styles from './HomeHero.module.css'

type Props = {
  title: string
  lead: string
  ctaText?: string | null
}

/* Прозрачная пустышка для <img> на узком экране — см. комментарий у <picture> */
const EMPTY_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"

/**
 * Первый экран главной: синяя полоса во всю ширину, текст слева,
 * иллюстрация справа.
 *
 * Иллюстрация декоративная: alt пустой, смысла в ней нет, весь текст
 * первого экрана рядом. fetchPriority="high" — она в первом экране и
 * участвует в LCP.
 *
 * Вектор из Figma, 1536×1024 (3:2). next/image здесь не нужен: SVG он
 * не оптимизирует и отдаёт как есть, а srcset, ради которого он стоял
 * у растра, вектору ни к чему.
 */
export default function HomeHero({ title, lead, ctaText }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          <RequestButton className={styles.cta} source="home-hero">
            {ctaText ?? 'Получить консультацию'}
          </RequestButton>
        </div>

        <div className={styles.art}>
          {/* Ниже 1200 иллюстрация спрятана (display: none), но обычный
              <img> скачал бы файл всё равно: display на загрузку не влияет.
              Поэтому сам SVG лежит в <source> с тем же брейкпоинтом, а у
              <img> в src пустышка — на узком экране в сеть не уходит ничего.
              width и height задают только пропорцию 3:2, размер — в CSS */}
          <picture>
            <source media="(min-width: 1200px)" srcSet="/illustrations/hero.svg" />
            <img
              src={EMPTY_IMAGE}
              alt=""
              width={507}
              height={338}
              fetchPriority="high"
              className={styles.artImage}
            />
          </picture>
        </div>
      </div>
    </section>
  )
}
