import { xprod } from 'ramda'
import { FontFileInput } from '../mutations/SaveFontFamily'

export type FontFlavour = [FontStyle, FontWeight]

export enum FontWeight {
  thin = 'Thin',
  'extra-light' = 'Extra Light',
  light = 'Light',
  regular = 'Regular',
  medium = 'Medium',
  bold = 'Bold',
  'extra-bold' = 'Extra Bold',
  black = 'Black',
}

export enum FontStyle {
  normal = '',
  italic = 'Italic',
}

// Number representing the mega multiplier (2^20)
export const MEGA = 1048576
export const FONT_FILE_EXTENSIONS = [
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
  '.svg',
]

const WEIGHT_STYLE_SEPARATOR = ','

export const STYLE_FLAVOUR_OPTIONS = xprod(
  Object.entries(FontStyle),
  Object.entries(FontWeight)
).map(([[styleValue, styleLabel], [weightValue, weightLabel]]) => ({
  label: (weightLabel + ' ' + styleLabel).trim(),
  value: flavourToString([styleValue, weightValue] as FontFlavour),
}))

export function flavourToString(value: FontFlavour | undefined) {
  return value && value.join(WEIGHT_STYLE_SEPARATOR)
}

export function stringToFlavour(value: string) {
  return value.split(WEIGHT_STYLE_SEPARATOR) as FontFlavour
}

export function getFontFlavour({
  fontStyle,
  fontWeight,
}: FontFileInput): FontFlavour {
  return [fontStyle, fontWeight] as FontFlavour
}

export function prettify(name: string) {
  return name
    .replace('__', ' ')
    .replace('_', ' ')
    .split(',')[0]
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function prettifyCamelCase(name: string) {
  const sentence = name.replace(/([a-z])([A-Z])/g, '$1 $2')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}
