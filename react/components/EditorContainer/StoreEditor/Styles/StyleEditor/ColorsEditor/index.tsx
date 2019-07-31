import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import startCase from 'lodash/startCase'
import { fromPairs, groupBy, toPairs } from 'ramda'

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

  const Header = useMemo(() => {
    return ({ name }: { name: string | React.ReactNode }) => (
      <StyleEditorHeader
        onButtonClick={onSave}
        buttonLabel={saveButtonLabel}
        title={name}
      />
    )
  }, [onSave, saveButtonLabel])

  const startEditing = useCallback(
    (token: string) => history.push(EditorPath.colors.replace(IdParam, token)),
    [history]
  )

  const groups = useMemo(
    () =>
      groupBy(([token]) => {
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
      }, toPairs(info)),
    [info]
  )

  const colourGroups = useMemo(
    () =>
      toPairs(groups).map(([groupName, group]) => (
        <ColorGroup
          groupName={startCase(groupName as string)}
          font={font}
          semanticColors={semanticColors}
          startEditing={startEditing}
          colorsInfo={fromPairs(group)}
        />
      )),
    [font, groups, semanticColors, startEditing]
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

  return (
    <>
      <Header name={colorsLabel} />
      <div className="flex-grow-1">{colourGroups}</div>
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
