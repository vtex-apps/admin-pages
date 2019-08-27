export interface Dimensions {
  width: number
  height: number
}

export interface IconProps {
  color?: string
  size?: number
  block?: boolean
}

export const calcIconSize: (d: Dimensions, s: number) => Dimensions = (
  iconBase,
  newSize
) => {
  const isHorizontal = iconBase.width >= iconBase.height

  const width = isHorizontal
    ? newSize
    : (newSize * iconBase.width) / iconBase.height

  const height = !isHorizontal
    ? newSize
    : (newSize * iconBase.height) / iconBase.width

  return { width, height }
}
