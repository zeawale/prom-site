import { createRequire } from 'node:module'
import { getIconData } from '@iconify/utils'
import { ICONS, FALLBACK_ICON } from '../lib/icons'

/**
 * Прогоняет весь ICONS через набор material-symbols.
 *
 * Зачем: поле icon — select, произвольную строку в него не введёшь, поэтому
 * упасть в FALLBACK_ICON по-хорошему нечему. Если фолбэк всё-таки сработал,
 * значит в ICONS лежит несуществующий глиф — и на сайте вместо иконки молча
 * рисуется квадратик с квадратиками. Молча — ключевое слово.
 *
 * Запуск: pnpm exec tsx src/scripts/check-icons.ts
 * Env не нужен: скрипт не ходит в базу.
 */

// require, а не import: JSON-модули в ESM требуют import attributes,
// которые tsx пробрасывает не во всех версиях Node
const require = createRequire(import.meta.url)
const collection = require('@iconify-json/material-symbols/icons.json')

let failed = 0

// --- 1. Дубли ключей ---
const seenValues = new Map<string, number>()
for (const { value } of ICONS) {
  seenValues.set(value, (seenValues.get(value) ?? 0) + 1)
}
for (const [value, count] of seenValues) {
  if (count > 1) {
    console.error(`ДУБЛЬ value: «${value}» встречается ${count} раза`)
    failed++
  }
}

// --- 2. Существование глифов ---
const symbolUsers = new Map<string, string[]>()

for (const { value, label, symbol } of ICONS) {
  symbolUsers.set(symbol, [...(symbolUsers.get(symbol) ?? []), value])

  const data = getIconData(collection, symbol)
  if (!data) {
    console.error(`НЕТ ГЛИФА: ${value} («${label}») → material-symbols:${symbol}`)
    failed++
  }
}

// --- 3. Фолбэк ---
if (!getIconData(collection, FALLBACK_ICON)) {
  console.error(`НЕТ ФОЛБЭКА: material-symbols:${FALLBACK_ICON}`)
  failed++
}

// --- 4. Разные ключи на один глиф — не ошибка, но повод посмотреть ---
for (const [symbol, values] of symbolUsers) {
  if (values.length > 1) {
    console.warn(`Один глиф на несколько ключей: ${symbol} ← ${values.join(', ')}`)
  }
}

if (failed) {
  console.error(`\nПровалено проверок: ${failed}. Иконок в наборе: ${ICONS.length}`)
  process.exit(1)
}

console.log(`Все ${ICONS.length} иконок резолвятся, фолбэк на месте.`)
