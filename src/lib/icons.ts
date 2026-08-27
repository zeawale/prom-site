/**
 * Единственный источник иконок проекта.
 * value  — ключ, который лежит в базе и виден в CMS
 * label  — подпись в выпадающем списке админки
 * symbol — имя в наборе material-symbols (через дефис, не через подчёркивание)
 */
export const ICONS = [
  // Документы и отчётность
  { value: 'report', label: 'Документ', symbol: 'description' },
  { value: 'calculator', label: 'Калькулятор', symbol: 'calculate' },
  { value: 'signature', label: 'Подпись', symbol: 'stylus-note' },
  { value: 'receipt', label: 'Чек', symbol: 'receipt-long' },
  { value: 'book', label: 'Книга', symbol: 'menu-book' },
  { value: 'folder', label: 'Папка', symbol: 'folder' },
  { value: 'print', label: 'Печать', symbol: 'print' },

  // Обмен и инфраструктура
  { value: 'exchange', label: 'Обмен данными', symbol: 'sync-alt' },
  { value: 'sync', label: 'Синхронизация', symbol: 'sync' },
  { value: 'network', label: 'Сеть', symbol: 'hub' },
  { value: 'globe', label: 'Сайт', symbol: 'language' },
  { value: 'cloud', label: 'Облако', symbol: 'cloud' },
  { value: 'server', label: 'Сервер', symbol: 'dns' },
  { value: 'database', label: 'База данных', symbol: 'database' },
  { value: 'mobile', label: 'Мобильное приложение', symbol: 'smartphone' },

  // Связь и контакты
  { value: 'phone', label: 'Телефон', symbol: 'call' },
  { value: 'email', label: 'Письмо', symbol: 'mail' },
  { value: 'clock', label: 'Часы', symbol: 'schedule' },
  { value: 'calendar', label: 'Календарь', symbol: 'calendar-month' },
  { value: 'location', label: 'Адрес', symbol: 'location-on' },
  { value: 'chat', label: 'Чат', symbol: 'chat' },
  { value: 'mic', label: 'Микрофон', symbol: 'mic' },
  { value: 'video', label: 'Видео', symbol: 'smart-display' },
  { value: 'headset', label: 'Поддержка', symbol: 'support-agent' },

  // Деньги и торговля
  { value: 'wallet', label: 'Кошелёк', symbol: 'account-balance-wallet' },
  { value: 'bank', label: 'Банк', symbol: 'account-balance' },
  { value: 'ruble', label: 'Рубль', symbol: 'currency-ruble' },
  { value: 'cart', label: 'Корзина', symbol: 'shopping-cart' },
  { value: 'cash-register', label: 'Касса', symbol: 'point-of-sale' },
  { value: 'barcode', label: 'Штрихкод', symbol: 'barcode' },
  { value: 'scan', label: 'Сканирование', symbol: 'document-scanner' },

  // Логистика
  { value: 'truck', label: 'Грузовик', symbol: 'local-shipping' },
  { value: 'warehouse', label: 'Склад', symbol: 'warehouse' },
  { value: 'package', label: 'Посылка', symbol: 'inventory-2' },
  { value: 'plane', label: 'Самолёт', symbol: 'flight' },

  // Люди и организация
  { value: 'users', label: 'Люди', symbol: 'group' },
  { value: 'handshake', label: 'Партнёрство', symbol: 'handshake' },
  { value: 'education', label: 'Обучение', symbol: 'school' },
  { value: 'certificate', label: 'Сертификат', symbol: 'workspace-premium' },
  { value: 'health', label: 'Медицина', symbol: 'local-hospital' },

  // Безопасность
  { value: 'shield', label: 'Щит', symbol: 'verified-user' },
  { value: 'lock', label: 'Замок', symbol: 'lock' },
  { value: 'key', label: 'Ключ', symbol: 'key' },

  // Преимущества и статусы
  { value: 'check', label: 'Галочка', symbol: 'check-circle' },
  { value: 'star', label: 'Звезда', symbol: 'star' },
  { value: 'sparkle', label: 'Искра', symbol: 'auto-awesome' },
  { value: 'bolt', label: 'Скорость', symbol: 'bolt' },
  { value: 'rocket', label: 'Запуск', symbol: 'rocket-launch' },
  { value: 'idea', label: 'Идея', symbol: 'lightbulb' },
  { value: 'timer', label: 'Таймер', symbol: 'timer' },
  { value: 'chart', label: 'График', symbol: 'trending-up' },
  { value: 'gear', label: 'Шестерёнка', symbol: 'settings' },
  { value: 'tools', label: 'Инструменты', symbol: 'build' },
  { value: 'search', label: 'Поиск', symbol: 'search' },
] as const satisfies { value: string; label: string; symbol: string }[]

export type IconName = (typeof ICONS)[number]['value']

/** Опции для селекта в CMS */
export const iconOptions = ICONS.map(({ value, label }) => ({ value, label }))

/** Ключ → имя глифа в material-symbols */
export const ICON_MAP = Object.fromEntries(
  ICONS.map(({ value, symbol }) => [value, symbol]),
) as Record<IconName, string>

export const FALLBACK_ICON = 'apps'

export const resolveIcon = (slug?: string | null): string =>
  (slug && ICON_MAP[slug as IconName]) || FALLBACK_ICON