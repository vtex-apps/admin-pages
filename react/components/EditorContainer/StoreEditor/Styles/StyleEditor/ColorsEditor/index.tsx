import startCase from 'lodash.startcase'
import { fromPairs, groupBy, toPairs } from 'ramda'
import React from 'react'

import { InjectedIntl, injectIntl } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import fromTachyonsConfig from '../utils/colors'
import ColorEditor from './ColorEditor'
import ColorGroup from './ColorGroup'

interface Props extends RouteComponentProps<ColorRouteParams> {
  intl: InjectedIntl
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
  intl,
  match,
  updateStyle,
  history,
  onSave,
}) => {
  const {
    params: { id },
  } = match
  const info = fromTachyonsConfig(semanticColors)

  const colorsLabel = intl.formatMessage({
    id: 'admin/pages.editor.styles.edit.colors.title',
  })

  const saveButtonLabel = intl.formatMessage({
    id: 'admin/pages.editor.components.button.save',
  })

  const Header = ({ name }: { name: string }) => (
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

export default injectIntl(ColorsEditor)
