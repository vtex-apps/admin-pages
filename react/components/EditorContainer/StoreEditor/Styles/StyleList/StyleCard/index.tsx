import React from 'react'
import { ActionMenu, Card, IconOptionsDots, Tag } from 'vtex.styleguide'

import Colors from '../../components/Colors'
import Typography from '../../components/Typography'

type StyleFunction = (style: Style) => void

interface Props {
  deleteStyle: StyleFunction
  duplicateStyle: StyleFunction
  selectStyle: StyleFunction
  startEditing: StyleFunction
  style: Style
}

const StyleCard: React.SFC<Props> = ({
  deleteStyle,
  duplicateStyle,
  selectStyle,
  startEditing,
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
    const options = [
      editable && {
        label: 'Edit',
        onClick: () => startEditing(style),
      },
      {
        label: 'Select as store style',
        onClick: () => selectStyle(style),
      },
      {
        label: 'Duplicate',
        onClick: () => duplicateStyle(style),
      },
      editable && {
        label: 'Delete',
        onClick: () => deleteStyle(style),
      },
    ]
    return options.filter(option => option)
  }

  return (
    <div className="mh3 mb3">
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
