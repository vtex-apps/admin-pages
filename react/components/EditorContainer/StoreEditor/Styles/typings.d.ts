interface StyleColors {
  emphasis: string
  action_primary: string
  action_secondary: string
  base: string
}

interface StyleTypography {
  fontFamily: FontFamilyProperty
  fontWeight: FontWeightProperty
  fontSize: FontSizeProperty
  textTransform: TextTransformProperty
  letterSpacing: LetterSpacingProperty
}

interface TachyonsConfig {
  semanticColors: {
    background: StyleColors
  }
  typography: {
    styles: {
      heading_2: StyleTypography
    }
  }
}

interface BasicStyle {
  id: string
  app: string
  name: string
}

interface Style extends BasicStyle {
  editable: boolean
  selected: boolean
  path: string
  config: TachyonsConfig
}

interface ActionMenuOption {
  label: string
  onClick: (style: Style) => void
}
