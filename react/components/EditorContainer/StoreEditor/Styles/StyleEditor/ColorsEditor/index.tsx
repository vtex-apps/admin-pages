import { fromPairs, groupBy, toPairs } from 'ramda'
import React, { useState } from 'react'

import fromTachyonsConfig from '../utils/colors'
import ColorEditor from './ColorEditor'
import ColorGroup from './ColorGroup'

interface Props {
  updateStyle: (partialConfig: Partial<TachyonsConfig>) => void
  semanticColors: SemanticColors
  font: Font
  addNavigation: (navigation: NavigationInfo) => void
}

type EditMode = string | undefined

const ColorsEditor: React.SFC<Props> = ({
  addNavigation,
  font,
  semanticColors,
  updateStyle,
}) => {
  const [editing, startEditing] = useState<EditMode>(undefined)

  const info = fromTachyonsConfig(semanticColors)

  if (editing) {
    return (
      <div className="flex-grow-1 overflow-scroll">
        <ColorEditor
          updateColor={updateColor(updateStyle)}
          token={editing}
          colorInfo={info[editing]}
        />
      </div>
    )
  }

  const groups = groupBy(([token]) => {
    if (token === 'emphasis') {
      return 'emphasis'
    } else if (token.startsWith('base')) {
      return 'base'
    } else if (token.startsWith('muted')) {
      return 'muted'
    } else if (
      token.startsWith('action') ||
      token === 'link' ||
      token === 'disabled'
    ) {
      return 'action'
    } else {
      return 'feedback'
    }
  }, toPairs(info))

  return (
    <div className="flex-grow-1 overflow-scroll">
      {toPairs(groups).map(groupInfo => {
        const [groupName, group] = groupInfo

        return (
          <ColorGroup
            groupName={groupName as string}
            font={font}
            semanticColors={semanticColors}
            startEditing={(token: string) => {
              startEditing(token)
              addNavigation({
                backButton: {
                  action: () => startEditing(undefined),
                  text: 'Back to Colors',
                },
                title: token,
              })
            }}
            colorsInfo={fromPairs(group)}
          />
        )
      })}
    </div>
  )
}

const updateColor = (updateStyle: Props['updateStyle']) => (
  token: string,
  colorInfo: ColorInfo
) => {
  const { configField, color } = colorInfo
  const partialConfig = {
    semanticColors: {
      [configField]: {
        [token]: color,
      },
    },
  }
  updateStyle(partialConfig)
}

export default ColorsEditor
