import React, { Component } from 'react'
import { Input } from 'vtex.styleguide'

interface Props {
  updateColors: (colors: SemanticColors) => void
  semanticColors: SemanticColors
}

export default class ColorsEditor extends Component<Props, {}> {
  public render() {
    const {
      semanticColors,
      semanticColors: {
        background,
        background: { base },
      },
      updateColors,
    } = this.props

    return (
      <Input
        value={base}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          updateColors({
            ...semanticColors,
            background: {
              ...background,
              base: event.target.value,
            },
          })
        }}
      />
    )
  }
}
