import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Плоский конфиг ESLint.
 *
 * Здесь был FlatCompat из @eslint/eslintrc — переходник, заворачивающий
 * старые конфиги (.eslintrc) в новый формат. Для eslint-config-next 16.3
 * он не лишний, а вредный: пакет сам отдаёт плоский конфиг массивом, где
 * `plugins` — объект вида { имя: плагин }. Валидатор eslintrc ждёт на
 * этом месте массив строк, признаёт конфиг невалидным и падает сам, пока
 * форматирует сообщение об ошибке: объект плагина ссылается сам на себя,
 * и JSON.stringify уходит в цикл. Отсюда и было загадочное
 * «Converting circular structure to JSON» вместо внятной жалобы.
 *
 * Проверено на месте: `import('eslint-config-next')` возвращает массив из
 * трёх элементов, а не объект в формате eslintrc.
 *
 * Состав тот же, что раньше собирался через compat.extends: правила
 * core-web-vitals и правила для TypeScript.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },

  {
    // Сгенерированное Payload не наше и правится только генератором
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]

export default eslintConfig
