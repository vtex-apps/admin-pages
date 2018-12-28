import React, { Component } from 'react'
import { Card, Radio } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

interface Props {
  style: Style
  checked: boolean
  onChange: (style: Style | undefined) => void
}

export default class StyleCard extends Component<Props, {}> {
  public render() {
    const { style, checked, onChange } = this.props
    const { app, name, colors, typography } = style
    const styleId = [app, name].join('/')

    return (
      <div className="ph3 pb3">
        <Card noPadding>
          <div className="ph4 pt3 pb2">
            <div className="flex justify-between items-center mb4">
              <Colors colors={colors} />
              <Typography typography={typography}/>
            </div>
            <div className="flex justify-between">
              <Radio
                checked={checked}
                id={styleId}
                label={name}
                onChange={() => onChange(style)}
                value={styleId}
              />
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
