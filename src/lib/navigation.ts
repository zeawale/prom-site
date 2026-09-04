export type NavItem = { label: string; href: string }

export const mainNav: NavItem[] = [
  { label: 'О компании', href: '/about' },
  { label: '1С сервисы', href: '/services' },
  { label: '1С:Фреш', href: '/fresh' },
  { label: '1С:ГРМ', href: '/grm' },
  { label: '1С:ИТС', href: '/its' },
  { label: 'Программы 1С', href: '/programs' },
  { label: 'Контакты', href: '/contacts' },
]

export const legalNav: NavItem[] = [
  { label: 'Политика обработки персональных данных', href: '/privacy' },
  { label: 'Политика использования cookie', href: '/cookie' },
  { label: 'Согласие на обработку персональных данных', href: '/consent' },
]
