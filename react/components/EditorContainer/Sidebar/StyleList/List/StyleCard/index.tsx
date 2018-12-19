import React, { Component } from 'react'
import { Button, Card, IconFailure, Radio } from 'vtex.styleguide'

import Colors from './Colors'

interface Props {
  style: Style
  checked: boolean
  onChange: (style: Style | undefined) => void
}

export default class StyleCard extends Component<Props, {}> {
  public render() {
    const { style, checked, onChange } = this.props
    const { app, name, colors } = style
    const styleId = [app, name].join('/')

    return (
      <div className="ph3 pb3">
        <Card noPadding>
          <div className="pl4 pt5 pb2">
            <Colors colors={colors} />
            <div className="flex justify-between">
              <Radio
                checked={checked}
                id={styleId}
                label={name}
                onChange={() => onChange(style)}
                value={styleId}
              />
              <div className="c-action-primary pb2 flex justify-between items-center">
                <IconFailure solid/>
                <Button size="small" variation="tertiary">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
