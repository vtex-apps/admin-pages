export const calcIconSize = (iconBase: any, newSize: any) => {
  const isHorizontal = iconBase.width >= iconBase.height

  const width = isHorizontal
    ? newSize
    : newSize * iconBase.width / iconBase.height

  const height = !isHorizontal
    ? newSize
    : newSize * iconBase.height / iconBase.width

  return { width, height }
}
