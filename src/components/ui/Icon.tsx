import { icons } from '@iconify-json/material-symbols'
import { getIconData, iconToSVG } from '@iconify/utils'
import { resolveIcon } from '@/lib/icons'

type Props = {
  slug?: string | null
  size?: number
  className?: string
}

export function Icon({ slug, size = 24, className }: Props) {
  const name = resolveIcon(slug)
  const data = getIconData(icons, name)
  if (!data) return null

  const { attributes, body } = iconToSVG(data, { height: String(size) })

  return (
    <svg
      {...attributes}
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
