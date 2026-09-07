/**
 * Кладёт woff2-сабсеты Montserrat из npm-пакета в public/fonts.
 *
 * Зачем копия, а не импорт CSS пакета напрямую: при импорте Next прогоняет
 * файлы через сборщик и выдаёт им хешированные имена в /_next/static/media.
 * Имя известно только после сборки, а <link rel="preload"> нужно написать
 * до неё. Стабильный путь в public — единственный способ получить preload,
 * а preload здесь и есть смысл всей затеи: без него шрифт запрашивается
 * только после разбора CSS, и первый экран успевает моргнуть системным.
 *
 * Файлы закоммичены в репозиторий, чтобы сайт собирался даже если скрипт
 * не отработал. Скрипт висит на prebuild: обновили пакет — обновление
 * шрифтов видно обычным git diff, а не выясняется через полгода.
 *
 * Копируются только normal-начертания: курсив на сайте встречается один
 * раз (подпись в MoreTariffs) и там достаточно синтетического наклона.
 */
import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const pkgDir = path.dirname(require.resolve('@fontsource-variable/montserrat/package.json'))
const srcDir = path.join(pkgDir, 'files')
const outDir = path.resolve(process.cwd(), 'public/fonts')

const files = (await readdir(srcDir)).filter((f) => f.endsWith('-wght-normal.woff2'))

if (files.length === 0) {
  console.error('copy-fonts: в пакете не нашлось ни одного файла *-wght-normal.woff2')
  process.exit(1)
}

await mkdir(outDir, { recursive: true })

let changed = 0
for (const file of files) {
  const from = path.join(srcDir, file)
  const to = path.join(outDir, file)

  // Сравниваем содержимое, а не даты: иначе каждая установка зависимостей
  // делает вид, что шрифты изменились, и мусорит в git status
  const same = await readFile(to)
    .then(async (existing) => existing.equals(await readFile(from)))
    .catch(() => false)

  if (same) continue

  await copyFile(from, to)
  changed++
  console.log(`copy-fonts: ${file}`)
}

console.log(
  changed ? `copy-fonts: обновлено файлов — ${changed}` : 'copy-fonts: шрифты уже актуальны',
)
