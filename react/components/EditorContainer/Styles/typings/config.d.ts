import {
  FontFamilyProperty,
  FontSizeProperty,
  FontWeightProperty,
  LetterSpacingProperty,
  TextTransformProperty,
} from 'csstype'

declare global {
  interface Font {
    fontFamily: FontFamilyProperty
    fontWeight: FontWeightProperty
    fontSize: FontSizeProperty
    textTransform: TextTransformProperty
    letterSpacing: LetterSpacingProperty
  }

  interface Tokens {
    [token: string]: string
  }

  interface SemanticColors {
    [field: string]: Tokens
  }

  interface TypographyStyles {
    heading_1: Font
    heading_2: Font
    heading_3: Font
    heading_4: Font
    heading_5: Font
    heading_6: Font
    body: Font
    small: Font
    mini: Font
    action: Font
    action__small: Font
    action__large: Font
    code: Font
  }

  interface TachyonsConfig {
    semanticColors: SemanticColors
    typography: {
      styles: TypographyStyles
    }
  }
}
