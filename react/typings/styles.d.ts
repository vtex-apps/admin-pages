interface StyleSelectorColors {
  emphasis: string
  action_primary: string
  action_secondary: string
  base: string
}

interface StyleSelectorTypography {
  fontFamily: FontFamilyProperty
  fontWeight: FontWeightProperty
  fontSize: FontSizeProperty
  textTransform: TextTransformProperty
  letterSpacing: LetterSpacingProperty
}

interface StyleBasic {
  app: string
  name: string
}

interface Style extends StyleBasic {
  path: string
  config: {
    semanticColors: {
      background: StyleSelectorColors
    }
    typography: {
      styles: {
        heading_2: StyleSelectorTypography
      }
    }
  }
  selected: boolean
}
