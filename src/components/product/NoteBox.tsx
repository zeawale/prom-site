import styles from './NoteBox.module.css'

type Props = {
  title?: string | null
  text: string
}

export default function NoteBox({ title, text }: Props) {
  return (
    <aside className={styles.box}>
      {title && <p className={styles.title}>{title}</p>}
      <p className={styles.text}>{text}</p>
    </aside>
  )
}
