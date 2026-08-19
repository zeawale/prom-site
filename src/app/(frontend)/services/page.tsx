import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ServicesPage() {
  const payload = await getPayload({ config })

  const { docs, totalDocs } = await payload.find({
    collection: 'services',
    limit: 100,
    depth: 1,
    sort: 'title',
  })

  return (
    <main>
      <h1>Сервисы 1С — {totalDocs}</h1>
      <ul>
        {docs.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong>
            {typeof s.category === 'object' && s.category !== null && (
              <span> — {s.category.title}</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}