import Image from 'next/image'
import { RequestButton } from '@/components/layout/RequestButton'
import styles from './HomeHero.module.css'

type Props = {
  title: string
  lead: string
  ctaText?: string | null
}

/**
 * Первый экран главной: синяя полоса во всю ширину, текст слева,
 * иллюстрация справа.
 *
 * Иллюстрация декоративная: alt пустой, смысла в ней нет, весь текст
 * первого экрана рядом. priority — она в первом экране и участвует в LCP.
 *
 * Растр 1014×684, ровно 2× от макета. Формат временный: из Figma она
 * выгружалась картинкой, а не вектором. Заменить на SVG — иллюстрация
 * векторная по построению, и в вебе ей место в вебе тоже вектором.
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
          <Image
            src="/illustrations/hero.png"
            alt=""
            width={507}
            height={342}
            priority
            className={styles.artImage}
          />
        </div>
      </div>
    </section>
  )
}
