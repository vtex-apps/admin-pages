import React, { useState } from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { ActionMenu, Card, IconOptionsDots, Tag } from 'vtex.styleguide'

import Colors from '../../components/Colors'
import Typography from '../../components/Typography'

type StyleFunction = (style: Style) => void
type StyleMutation = (style: Style) => Promise<unknown>

interface Props {
  deleteStyle: StyleMutation
  duplicateStyle: StyleMutation
  intl: InjectedIntl
  selectStyle: StyleMutation
  startEditing: StyleFunction
  style: Style
}

const StyleCard: React.FunctionComponent<Props> = ({
  deleteStyle,
  duplicateStyle,
  intl,
  selectStyle,
  startEditing,
  style,
  style: { app: appId, name, selected, editable, config },
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const setIsLoadingWrapper = (fn: () => Promise<any>) => async () => {
    setIsLoading(true)
    await fn()
    setIsLoading(false)
  }

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
        label: intl.formatMessage({ id: 'pages.editor.styles.card.menu.edit' }),
        onClick: () => startEditing(style),
      },
      !selected && {
        label: intl.formatMessage({
          id: 'pages.editor.styles.card.menu.select',
        }),
        onClick: setIsLoadingWrapper(() => selectStyle(style)),
      },
      {
        label: intl.formatMessage({
          id: 'pages.editor.styles.card.menu.duplicate',
        }),
        onClick: setIsLoadingWrapper(() => duplicateStyle(style)),
      },
      !selected &&
        editable && {
          label: intl.formatMessage({
            id: 'pages.editor.styles.card.menu.delete',
          }),
          onClick: async () => {
            setIsLoading(true)
            try {
              await deleteStyle(style)
            } catch (e) {
              setIsLoading(false)
            }
          },
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
                  {intl.formatMessage(
                    { id: 'pages.editor.styles.card.name.app-subtitle' },
                    { app: appId.split('@')[0] }
                  )}
                </span>
              )}
            </div>
            <ActionMenu
              hideCaretIcon
              buttonProps={{
                icon: <IconOptionsDots />,
                iconPosition: 'right',
                isLoading,
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
              <Tag bgColor="#F71963" color="#FFFFFF">
                {intl.formatMessage({ id: 'pages.editor.styles.card.current' })}
              </Tag>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default injectIntl(StyleCard)
