import startCase from 'lodash.startcase'
import { groupBy, mapObjIndexed } from 'ramda'
import React from 'react'
import { ColorPicker } from 'vtex.styleguide'

interface Props {
  updateColor: (token: string, color: ColorInfo) => void
  token: string
  colorInfo: ColorInfo[]
}

interface ColorPickerColors {
  hex: string
}

const sixDigitsColors = (color: string) => {
  if (/^#[A-Fa-f0-9]{3}$/.test(color)) {
    return color.replace(
      /#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])/,
      '#$1$1$2$2$3$3'
    )
  }
  return color
}

const fieldName = (id: string) => {
  switch (id) {
    case 'background':
      return 'Background'
    case 'on':
      return 'Text on background'
    case 'text':
      return 'Text'
    case 'border':
      return 'Border'
    default:
      return ''
  }
}

const ColorsEditor: React.SFC<Props> = ({ colorInfo, updateColor, token }) => {
  const groups = groupBy(info => {
    return fieldName(info.path.split('.')[0])
  }, colorInfo)
  return (
    <div className="overflow-scroll">
      {Object.values(
        mapObjIndexed((group: ColorInfo[], field: string) => {
          return (
            <div className="ph6 bt b--muted-5">
              <div className="f4 bb b--muted-5 pv6">{field}</div>
              <div className="pv4">
                {group.map(info => {
                  return (
                    <ColorPicker
                      label={startCase(info.path.split('.')[1])}
                      color={{ hex: sixDigitsColors(info.color) }}
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
        }, groups)
      )}
    </div>
  )
}

export default ColorsEditor
