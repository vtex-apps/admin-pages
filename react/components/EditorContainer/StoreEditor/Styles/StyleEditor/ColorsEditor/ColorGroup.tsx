import { find, mapObjIndexed, propEq } from 'ramda'
import React from 'react'

import Typography from '../../components/Typography'

const COLOR_BLOCK_SIZE = '40px'

interface Props {
  groupName: string
  colorsInfo: Colors
  font: Font
  startEditing: (token: string) => void
  semanticColors: SemanticColors
}

const ColorGroup: React.SFC<Props> = ({
  colorsInfo,
  font,
  groupName,
  semanticColors,
  startEditing,
}) => {
  return (
    <div className="ph6 bt b--muted-5">
      <div className="f4 flex items-center pv5">{groupName}</div>
      <div>
        {Object.values(
          mapObjIndexed((info: ColorInfo[], token: string) => {
            return (
              <ColorPreview
                key={token}
                previewInfo={{
                  backgroundColor: semanticColors.background.base,
                  font,
                  textColor: semanticColors.text.link,
                }}
                token={token}
                startEditing={startEditing}
                colorInfo={info}
              />
            )
          }, colorsInfo)
        )}
      </div>
    </div>
  )
}

interface ColorPreviewProps {
  colorInfo: ColorInfo[]
  previewInfo: {
    font: Font
    backgroundColor: string
    textColor: string
  }
  startEditing: (token: string) => void
  token: string
}

const ColorPreview: React.SFC<ColorPreviewProps> = ({
  colorInfo,
  previewInfo,
  startEditing,
  token,
}) => {
  const backgroundColor = find(propEq('configField', 'background'), colorInfo)
  const textColor = find(propEq('configField', 'on'), colorInfo)

  return (
    <div
      className="pv5 flex items-center"
      onClick={() => {
        startEditing(token)
      }}
    >
      <div
        className="ba br2 b--muted-5 flex justify-center items-center"
        style={{
          backgroundColor:
            (backgroundColor && backgroundColor.color) ||
            previewInfo.backgroundColor,
          height: COLOR_BLOCK_SIZE,
          width: COLOR_BLOCK_SIZE,
        }}
      >
        <Typography
          typography={previewInfo.font}
          textColor={(textColor && textColor.color) || previewInfo.textColor}
        />
      </div>
      <div className="ml3">{token}</div>
    </div>
  )
}

export default ColorGroup
