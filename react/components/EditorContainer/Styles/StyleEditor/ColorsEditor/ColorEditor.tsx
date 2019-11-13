import startCase from 'lodash/startCase'
import { groupBy, mapObjIndexed } from 'ramda'
import React from 'react'
import { ColorPicker } from 'vtex.styleguide'

interface Props {
  updateColor: (token: string, color: ColorInfo) => void
  token: string
  colorInfo: ColorInfo[]
}

interface ColorPickerColors {
  hex?: string
  rgba?: {
    r: number
    g: number
    b: number
    a: number
  }
}

const getColorObject = (color: string): ColorPickerColors => {
  if (/^#[A-Fa-f0-9]{3}$/.test(color)) {
    return {
      hex: color.replace(
        /#([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])/,
        '#$1$1$2$2$3$3'
      ),
    }
  }
  const rgbaGroup = color.match(/\(.*\)/)
  if (rgbaGroup) {
    const rgbaInfo = rgbaGroup[0].slice(1, -1).split(',')
    return {
      hex: '#ffffff',
      rgba: {
        a: parseFloat(rgbaInfo[3]),
        b: parseFloat(rgbaInfo[2]),
        g: parseFloat(rgbaInfo[1]),
        r: parseFloat(rgbaInfo[0]),
      },
    }
  }
  return { hex: color }
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

const ColorsEditor: React.FunctionComponent<Props> = ({
  colorInfo,
  updateColor,
  token,
}) => {
  const groups = groupBy(info => {
    return fieldName(info.path.split('.')[0])
  }, colorInfo)
  return (
    <div className="overflow-scroll h-100">
      {Object.values(
        mapObjIndexed((group: ColorInfo[], field: string) => {
          return (
            <div className="ph6 bt b--muted-5" key={field}>
              <div className="f4 bb b--muted-5 pv6">{field}</div>
              <div className="pv4">
                {group.map(info => {
                  const key = info.path.split('.')[1]

                  return (
                    <ColorPicker
                      key={key}
                      label={startCase(key)}
                      color={getColorObject(info.color)}
                      colorHistory={[]}
                      onChange={({ rgba }: ColorPickerColors) => {
                        if (rgba) {
                          const { r, g, b, a } = rgba
                          const newInfo = {
                            ...info,
                            color: `rgba(${r},${g},${b},${a})`,
                          }
                          updateColor(token, newInfo)
                        }
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
