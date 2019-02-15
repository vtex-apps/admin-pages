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

  interface Base {
    base: string
    base__inverted: string
  }

  interface Action {
    action_primary: string
    action_secondary: string
  }

  interface Emphasis {
    emphasis: string
  }

  interface Link {
    link: string
  }

  interface Disabled {
    disabled: string
  }

  interface Info {
    success: string
    success__faded: string
    danger: string
    danger__faded: string
    warning: string
    warning__faded: string
  }

  interface Muted {
    muted_1: string
    muted_2: string
    muted_3: string
    muted_4: string
    muted_5: string
  }

  interface SemanticColors {
    background: Base & Action & Emphasis & Disabled & Info & Muted
    hover_background: Action & Emphasis & Info & Muted
    active_background: Action & Emphasis & Info & Muted
    text: Action & Link & Emphasis & Disabled & Info & Muted
    visited_text: Link
    hover_text: Action & Link & Emphasis & Info
    active_text: Link & Emphasis & Info
    border: Action & Emphasis & Disabled & Info & Muted
    hover_border: Action & Emphasis & Info & Muted
    active_border: Action & Emphasis & Info & Muted
    on: Base & Action & Emphasis & Disabled & Info & Muted
    hover_on: Action & Emphasis & Info
    active_on: Action & Emphasis & Info
  }

  interface TachyonsConfig {
    semanticColors: SemanticColors
    typography: {
      styles: {
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
    }
  }
}
