import type { Field } from 'payload'
import { iconOptions } from '@/lib/icons'

export const iconField = (): Field => ({
  name: 'icon',
  type: 'select',
  label: 'Иконка',
  required: true,
  defaultValue: 'gear',
  options: [...iconOptions],
})