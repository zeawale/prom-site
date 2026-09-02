// Запуск из корня: pnpm exec tsx src/scripts/check-icons.ts
// Payload не трогает, поэтому --env-file не нужен.

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { ICONS } from '../lib/icons'

const require = createRequire(import.meta.url)

const set = require('@iconify-json/material-symbols/icons.json') as {
  icons: Record<string, unknown>
  aliases?: Record<string, unknown>
}

const inSet = (name: string) =>
  name in set.icons || Boolean(set.aliases && name in set.aliases)

let failed = false
const fail = (msg: string) => {
  failed = true
  console.error(msg)
}

// ── 1. Дубли value ──────────────────────────────────────────────
const seen = new Map<string, number>()
for (const { value } of ICONS) seen.set(value, (seen.get(value) ?? 0) + 1)
for (const [value, n] of seen) {
  if (n > 1) fail(`ДУБЛЬ value: "${value}" встречается ${n} раза`)
}

// ── 2. Каждый symbol существует в наборе ────────────────────────
const missingGlyphs = ICONS.filter((i) => !inSet(i.symbol))
if (missingGlyphs.length) {
  for (const i of missingGlyphs) {
    fail(`НЕТ ГЛИФА: value "${i.value}" → symbol "${i.symbol}" отсутствует в material-symbols`)
  }
} else {
  console.log(`✓ Все ${ICONS.length} глифов найдены в наборе`)
}

// ── 3. Иконки из 1c_programs.json — это value, а не symbol ──────
type ProgramsFile = {
  programs: { slug: string; cards?: { icon?: string }[] }[]
}
const programs = JSON.parse(
  readFileSync('src/seed/1c_programs.json', 'utf8'),
) as ProgramsFile

const values = new Set(ICONS.map((i) => i.value))
const used = new Map<string, string[]>()

for (const p of programs.programs) {
  for (const c of p.cards ?? []) {
    if (!c.icon) continue
    used.set(c.icon, [...(used.get(c.icon) ?? []), p.slug])
  }
}

for (const [icon, slugs] of used) {
  const values = new Set<string>(ICONS.map((i) => i.value))
  if (values.has(icon)) continue
  const where = slugs.join(', ')

  if (inSet(icon)) {
    fail(
      `НЕ КЛЮЧ, А ГЛИФ: "${icon}" (${where}). Глиф существует, ключа в ICONS нет.\n` +
        `  → добавить в ICONS: { value: '${icon}', label: '…', symbol: '${icon}' }\n` +
        `  → либо заменить в JSON на существующий value`,
    )
  } else {
    fail(`НЕТ НИГДЕ: "${icon}" (${where}) — ни ключа в ICONS, ни глифа в наборе`)
  }
}

if (!failed) console.log('✓ Все иконки из 1c_programs.json есть в ICONS')
process.exit(failed ? 1 : 0)