import startCase from 'lodash.startcase'
import { fromPairs, groupBy, toPairs } from 'ramda'
import React, { useState } from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

import fromTachyonsConfig from '../utils/colors'
import ColorEditor from './ColorEditor'
import ColorGroup from './ColorGroup'

interface Props {
  intl: InjectedIntl
  updateStyle: (partialConfig: Partial<TachyonsConfig>) => void
  semanticColors: SemanticColors
  font: Font
  addNavigation: (navigation: NavigationInfo) => void
}

type EditMode = string | undefined

const ColorsEditor: React.FunctionComponent<Props> = ({
  addNavigation,
  font,
  intl,
  semanticColors,
  updateStyle,
}) => {
  const [editing, startEditing] = useState<EditMode>(undefined)

  const info = fromTachyonsConfig(semanticColors)

  if (editing) {
    return (
      <div className="flex-grow-1 overflow-y-auto overflow-x-hidden">
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
    <div className="flex-grow-1">
      {toPairs(groups).map(groupInfo => {
        const [groupName, group] = groupInfo

        return (
          <ColorGroup
            groupName={startCase(groupName as string)}
            font={font}
            semanticColors={semanticColors}
            startEditing={(token: string) => {
              startEditing(token)
              addNavigation({
                backButton: {
                  action: () => startEditing(undefined),
                  text: intl.formatMessage({
                    id: 'admin/pages.editor.styles.color-group.back',
                  }),
                },
                title: startCase(token),
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

export default injectIntl(ColorsEditor)
