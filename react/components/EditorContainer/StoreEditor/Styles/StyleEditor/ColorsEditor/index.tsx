import React from 'react'

import startCase from 'lodash.startcase'
import { fromPairs, groupBy, toPairs } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import fromTachyonsConfig from '../utils/colors'
import ColorEditor from './ColorEditor'
import ColorGroup from './ColorGroup'

interface Props extends RouteComponentProps<ColorRouteParams> {
  updateStyle: (partialConfig: Partial<TachyonsConfig>) => void
  config: TachyonsConfig
  onSave: () => void
}

const ColorsEditor: React.FunctionComponent<Props> = ({
  config: {
    semanticColors,
    typography: {
      styles: { heading_6: font },
    },
  },
  match,
  updateStyle,
  history,
  onSave,
}) => {
  const {
    params: { id },
  } = match
  const info = fromTachyonsConfig(semanticColors)

  const colorsLabel = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.colors.title"
      defaultMessage="Colors"
    />
  )

  const saveButtonLabel = (
    <FormattedMessage
      id="admin/pages.editor.components.button.save"
      defaultMessage="Save"
    />
  )

  const Header = ({ name }: { name: string | React.ReactNode }) => (
    <StyleEditorHeader
      onAux={onSave}
      auxButtonLabel={saveButtonLabel}
      title={name}
    />
  )

  if (id) {
    return (
      <>
        <Header name={startCase(id)} />
        <div className="flex-grow-1 overflow-y-auto overflow-x-hidden">
          <ColorEditor
            updateColor={updateColor(updateStyle)}
            token={id}
            colorInfo={info[id]}
          />
        </div>
      </>
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
    <>
      <Header name={colorsLabel} />
      <div className="flex-grow-1">
        {toPairs(groups).map(groupInfo => {
          const [groupName, group] = groupInfo

          return (
            <ColorGroup
              groupName={startCase(groupName as string)}
              font={font}
              semanticColors={semanticColors}
              startEditing={(token: string) =>
                history.push(EditorPath.colors.replace(IdParam, token))
              }
              colorsInfo={fromPairs(group)}
            />
          )
        })}
      </div>
    </>
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
