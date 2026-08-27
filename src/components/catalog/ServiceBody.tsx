import type { ReactNode } from 'react'
import type { Service } from '@/payload-types'
import { visibleRelated } from '@/lib/services'
import { Icon } from '@/components/ui/Icon'
import { RequestButton } from '@/components/layout/RequestButton'
import styles from './ServiceDetail.module.css'

type Props = {
  service: Service
  /** Источник заявки: 'service' для попапа, 'service-page' для страницы */
  source: string
  /** Как рендерить связанные сервисы: ссылками или кнопками попапа */
  renderRelated: (related: Service[]) => ReactNode
}

export function ServiceBody({ service, source, renderRelated }: Props) {
  const related = visibleRelated(service.related)
  const steps = service.popup?.howItWorks ?? []
  const whoNeedsIt = service.popup?.whoNeedsIt ?? []
  const requirements = service.popup?.requirements ?? []

  const categoryTitle =
    typeof service.category === 'object' && service.category !== null
      ? service.category.title
      : null

  return (
    <article className={styles.detail}>
      <header className={styles.head}>
        <span className={styles.iconBox}>
          <Icon slug={service.icon} size={24} />
        </span>
        <div>
          <h1 className={styles.title}>{service.title}</h1>
          {categoryTitle && <p className={styles.category}>{categoryTitle}</p>}
        </div>
      </header>

      <div className={styles.highlight}>
        <p className={styles.highlight_title}>{service.headline}</p>
        <p className={styles.description}>{service.description}</p>
      </div>

      {whoNeedsIt.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Кому нужен</h2>
          <ul className={styles.checkList}>
            {whoNeedsIt.map((item) => (
              <li key={item.id} className={styles.checkItem}>
                <Icon slug="check" size={20} className={styles.checkIcon} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {steps.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Как это работает</h2>
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.id} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {requirements.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Что нужно для подключения</h2>
          <ul className={styles.reqList}>
            {requirements.map((item) => (
              <li key={item.id} className={styles.reqItem}>
                {item.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Часто берут вместе</h2>
          <div className={styles.relatedGrid}>{renderRelated(related)}</div>
        </section>
      )}

      <footer className={styles.cta}>
        <RequestButton
          className={styles.ctaButton}
          source={`${source}:${service.slug}`}
        >
          {service.popup?.ctaText ?? 'Подключить сервис'}
        </RequestButton>
      </footer>
    </article>
  )
}