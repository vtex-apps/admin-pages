import { xprod } from 'ramda'
import { FontFileInput } from '../mutations/SaveFontFamily'
import startCase from 'lodash.startcase'

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
