import { groupBy, mapObjIndexed } from 'ramda'
import React, { Component } from 'react'
import { ColorPicker } from 'vtex.styleguide'

interface Props {
  updateColor: (token: string, color: ColorInfo) => void
  token: string
  colorInfo: ColorInfo[]
}

interface ColorPickerColors {
  hex: string
}

export default class ColorsEditor extends Component<Props, {}> {
  public render() {
    const { colorInfo } = this.props

    const groups = groupBy(info => {
      return info.path.split('.')[0]
    }, colorInfo)
    return (
      <div className="overflow-scroll">
        {Object.values(
          mapObjIndexed((group: ColorInfo[], field: string) => {
            return this.renderColorGroup(group, field)
          }, groups)
        )}
      </div>
    )
  }

  private renderColorGroup(group: ColorInfo[], field: string) {
    const { updateColor, token } = this.props

    return (
      <div className="ph6 bt b--muted-5">
        <div className="f4 bb b--muted-5 pv6">{field}</div>
        <div className="pv4">
          {group.map(info => {
            return (
              <ColorPicker
                label={info.path.split('.')[1]}
                color={{ hex: this.sixDigitsColors(info.color) }}
                colorHistory={[]}
                onChange={({ hex }: ColorPickerColors) => {
                  const newInfo = { ...info, color: hex }
                  updateColor(token, newInfo)
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  private sixDigitsColors(color: string) {
    if (/^#[A-Fa-f0-9]{3}$/.test(color)) {
      return color.replace(
        /#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])/,
        '#$1$1$2$2$3$3'
      )
    }
    return color
  }
}
