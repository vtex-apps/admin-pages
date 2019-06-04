import startCase from 'lodash.startcase'
import { xprod } from 'ramda'

import { FontFileInput } from '../mutations/SaveFontFamily'
import { FontFamily } from '../queries/ListFontsQuery'

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

interface DropdownOption {
  value: string
  label: string
}

export function getTypeTokenDropdownOptions(
  key: keyof Font,
  font: Font,
  fontFamilies: FontFamily[]
): DropdownOption[] {
  const options = (() => {
    switch (key) {
      case 'fontFamily':
        return fontFamilies.map(({ fontFamily }) => ({
          label: fontFamily,
          value: fontFamily,
        }))
      case 'fontWeight':
        return [
          { label: 'Thin', value: '100' },
          { label: 'Extra Light', value: '200' },
          { label: 'Light', value: '300' },
          { label: 'Normal', value: '400' },
          { label: 'Medium', value: '500' },
          { label: 'Semi Bold', value: '600' },
          { label: 'Bold', value: '700' },
          { label: 'Extra Bold', value: '800' },
          { label: 'Black', value: '900' },
        ]
      case 'fontSize':
        return [
          { label: '48px', value: '3rem' },
          { label: '36px', value: '2.25rem' },
          { label: '24px', value: '1.5rem' },
          { label: '20px', value: '1.25rem' },
          { label: '16px', value: '1rem' },
          { label: '14px', value: '.875rem' },
          { label: '12px', value: '.75rem' },
        ]
      case 'letterSpacing':
        return [
          { label: 'Normal', value: 'normal' },
          { label: 'Tracked', value: '.1em' },
          { label: 'Tracked Tight', value: '-.05em' },
          { label: 'Tracked Mega', value: '.25em' },
          { label: 'Zero', value: '0' },
        ]
      case 'textTransform':
        return [
          { label: 'None', value: 'none' },
          { label: 'Capitalize', value: 'capitalize' },
          { label: 'Uppercase', value: 'uppercase' },
          { label: 'Lowercase', value: 'lowercase' },
        ]
    }
  })()

  const currentIfNotInOptions =
    options.find(({ value }) => value === font[key]) == null
      ? [{ label: startCase(font[key].split(',')[0]), value: font[key] }]
      : []

  return [...currentIfNotInOptions, ...options]
}
