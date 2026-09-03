import { redirect } from 'next/navigation'

export default function ProgramsIndex() {
  // Отдельной обзорной страницы раздела в макете нет —
  // корень ведёт на первую программу по полю order
  redirect('/programs/buhgalteriya')
}
