import React, { Component } from 'react'

interface ColorsProps {
  colors: StyleSelectorColors
}

interface ColorContainerOptions {
  rightBorder?: boolean
  leftBorder?: boolean
}

export default class Colors extends Component<ColorsProps, {}> {
  public render() {
    const { colors: { action_primary, action_secondary, base, emphasis } } = this.props

    const colorContainer = (color: string, options: ColorContainerOptions = {}) => (
      <div className={`w2 h2 br2 ${options.rightBorder ? '' : 'br--left'} ${options.leftBorder ? '' : 'br--right'}`} style={{
        backgroundColor: color
      }}/>
    )

    return (
      <div className="w4 flex ba br2 b--muted-5 bg-muted-5">
        {colorContainer(emphasis, { leftBorder: true })}
        {colorContainer(action_primary)}
        {colorContainer(action_secondary)}
        {colorContainer(base, { rightBorder: true })}
      </div>
    )
  }
}
