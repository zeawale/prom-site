import fs from 'fs'

const data = JSON.parse(
  fs.readFileSync('src/seed/1c_services_catalog.json', 'utf-8'),
)

const rows = data
  .map((s) => ({
    id: s.id,
    h: s.headline.length,
    d: s.description.length,
    dw: s.description.trim().split(/\s+/).length,
  }))
  .sort((a, b) => b.d - a.d)

console.log('--- Описания, топ-15 по длине ---')
for (const r of rows.slice(0, 15)) {
  console.log(`${String(r.d).padStart(4)} симв / ${String(r.dw).padStart(2)} слов  ${r.id}`)
}

console.log('\n--- Заголовки, топ-15 по длине ---')
for (const r of [...rows].sort((a, b) => b.h - a.h).slice(0, 15)) {
  console.log(`${String(r.h).padStart(4)} симв  ${r.id}`)
}