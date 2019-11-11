import { forEachObjIndexed } from 'ramda'

const fromSemanticColors = (semanticColors: SemanticColors): Colors => {
  const getFieldPath = (name: string) => {
    let fieldPath = name.split('_')
    if (fieldPath.length === 1) {
      fieldPath = ['default'].concat(fieldPath)
    }
    return fieldPath.reverse().join('.')
  }

  const colors: Colors = {}
  forEachObjIndexed((tokens: Tokens, field: string) => {
    forEachObjIndexed((color: string, token: string) => {
      if (token.startsWith('__')) {
        return
      }
      const info: ColorInfo = {
        color,
        configField: field,
        path: getFieldPath(field),
      }
      colors[token] = (colors[token] || []).concat(info)
    }, tokens)
  }, semanticColors)

  return colors
}

export default fromSemanticColors
