import styles from './BlueBand.module.css'

/**
 * Синяя полоса главной во всю ширину. Внутри идут два блока —
 * «Направления работы» и «Сервисы 1С»: в макете у них общий фон,
 * и разрезать его на две секции значило бы удвоить отступ на стыке.
 */
export default function BlueBand({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.band}>
      <div className={styles.inner}>{children}</div>
    </div>
  )
}
