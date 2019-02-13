import React from 'react'
import { ActionMenu, Card, IconOptionsDots, Tag } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

type StyleMutation = (style: Style) => void

interface Props {
  deleteStyle: StyleMutation
  duplicateStyle: StyleMutation
  selectStyle: StyleMutation
  style: Style
}

const StyleCard: React.SFC<Props> = ({
  deleteStyle,
  duplicateStyle,
  selectStyle,
  style,
  style: { app: appId, name, selected, editable, config },
}) => {
  const {
    action_primary,
    action_secondary,
    base,
    emphasis,
  } = config.semanticColors.background

  const typography = config.typography.styles.heading_2

  const createMenuOptions = () => {
    const mainOptions = [
      {
        label: 'Select as store style',
        onClick: () => selectStyle(style),
      },
      {
        label: 'Duplicate',
        onClick: () => duplicateStyle(style),
      },
    ]
    const editableStyleOptions = editable
      ? [
          {
            label: 'Delete',
            onClick: () => deleteStyle(style),
          },
        ]
      : []
    return [...mainOptions, ...editableStyleOptions]
  }

  return (
    <div className="ph3 pb3">
      <Card noPadding>
        <div className="ph5 pt5 pb2">
          <div className="flex justify-between items-center mb4">
            <div className="flex items-center h2 w-80">
              <span className="mr5 truncate">{name}</span>
              {!editable && (
                <span className="f7 c-muted-2 truncate">
                  created by {appId.split('@')[0]}
                </span>
              )}
            </div>
            <ActionMenu
              label="Actions"
              icon={<IconOptionsDots />}
              hideCaretIcon
              buttonProps={{
                icon: true,
                variation: 'tertiary',
              }}
              options={createMenuOptions()}
            />
          </div>
          <div className="flex justify-between items-center mb5">
            <div className="flex items-center">
              <Typography typography={typography} />
              <div className="pl5">
                <Colors
                  colors={[emphasis, action_primary, action_secondary, base]}
                />
              </div>
            </div>
            {selected && (
              <div className="emphasis">
                <Tag>Current</Tag>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StyleCard
