import { mergeDeepRight } from 'ramda'
import React, { useCallback, useReducer, useState } from 'react'
import { defineMessages, InjectedIntl, injectIntl } from 'react-intl'
import { ShowToastFunction } from 'vtex.styleguide'

import { RenameStyleFunction } from './mutations/RenameStyle'
import { UpdateStyleFunction } from './mutations/UpdateStyle'
import GenerateStyleSheetQuery from './queries/GenerateStyleSheet'
import StyleEditorRouter from './StyleEditorRouter'

interface Props {
  style: Style
  intl: InjectedIntl
  renameStyle: RenameStyleFunction
  updateStyle: UpdateStyleFunction
  setStyleAsset: (asset: StyleAssetInfo) => void
  showToast: ShowToastFunction
  stopEditing: () => void
}

type ConfigReducer = (
  config: TachyonsConfig,
  partialConfig: DeepPartial<TachyonsConfig>
) => TachyonsConfig

defineMessages({
  saveFailed: {
    defaultMessage: 'An error occurred while saving your style.',
    id: 'admin/pages.editor.styles.edit.save.failed',
  },
  saveSuccessful: {
    defaultMessage: 'Style saved successfully.',
    id: 'admin/pages.editor.styles.edit.save.successful',
  },
})

const StyleEditorStates: React.FunctionComponent<Props> = ({
  style,
  intl,
  renameStyle,
  setStyleAsset,
  updateStyle,
  showToast,
  stopEditing,
}) => {
  const nameState = useState<string>(style.name)
  const [name] = nameState
  const configReducer = useReducer<ConfigReducer>(
    mergeDeepRight as ConfigReducer,
    style.config
  )
  const [config] = configReducer

  const editingState = useState(false)
  const [_, setEditing] = editingState

  const hooks = {
    config: configReducer,
    editing: editingState,
    name: nameState,
  }

  const saveStyle = useCallback(
    async () => {
      await renameStyle({ variables: { id: style.id, name } })
      const result = await updateStyle({
        variables: { id: style.id, config },
      })
      const styleInfo = result && result.data && result.data.updateStyle
      if (styleInfo) {
        const { path, selected } = styleInfo
        setStyleAsset({
          keepSheet: true,
          selected,
          type: 'path',
          value: path,
        })
        showToast({
          horizontalPosition: 'left',
          message: intl.formatMessage({
            id: 'admin/pages.editor.styles.edit.save.successful',
          }),
        })
      } else {
        showToast({
          horizontalPosition: 'left',
          message: intl.formatMessage({
            id: 'admin/pages.editor.styles.edit.save.failed',
          }),
        })
      }
    },
    [style, name, config]
  )

  const onSave = useCallback(
    () => {
      setEditing(false)
      saveStyle()
    },
    [saveStyle, setEditing]
  )

  return (
    <GenerateStyleSheetQuery
      variables={{ config }}
      fetchPolicy={'network-only'}
    >
      {({ data }) => (
        <StyleEditorRouter
          data={data || null}
          hooks={hooks}
          onSave={onSave}
          setStyleAsset={setStyleAsset}
          stopEditing={stopEditing}
          style={style}
        />
      )}
    </GenerateStyleSheetQuery>
  )
}

export default injectIntl(StyleEditorStates)
