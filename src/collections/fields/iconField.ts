import type { Field } from 'payload'
import { iconOptions } from '@/lib/icons'

type IconFieldOptions = {
  required?: boolean
}

// required по умолчанию true: так вызывают Services и Categories,
// а дефолт должен совпадать с большинством, чтобы аргумент дописывать
// приходилось в исключении, а не в норме
export const iconField = ({ required = true }: IconFieldOptions = {}): Field => ({
  name: 'icon',
  type: 'select',
  label: 'Иконка',
  required,
  // Дефолт осмыслен только у обязательного поля. У необязательного он молча
  // проставит шестерёнку карточке, которая по раскладке иконку не выводит
  defaultValue: required ? 'gear' : undefined,
  options: [...iconOptions],
})