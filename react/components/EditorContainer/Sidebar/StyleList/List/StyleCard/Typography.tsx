import React, { Component } from 'react'

interface TypographyProps {
  typography: StyleTypography
}

export default class Typography extends Component<TypographyProps, {}> {
  public render() {
    const { typography: { fontFamily, fontSize, fontWeight, textTransform, letterSpacing } } = this.props

    return (
      <div style={{
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        textTransform,
      }}>
        Aa
      </div>
    )
  }
}
