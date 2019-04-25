import { mergeDeepRight } from 'ramda'
import React, { useReducer, useState } from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { ShowToastFunction } from 'vtex.styleguide'

import { RenameStyleFunction } from './mutations/RenameStyle'
import { UpdateStyleFunction } from './mutations/UpdateStyle'
import GenerateStyleSheetQuery, {
  GenerateStyleSheetData,
} from './queries/GenerateStyleSheet'
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
  partialConfig: Partial<TachyonsConfig>
) => TachyonsConfig

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

  const saveStyle = async () => {
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
        horizontalPosition: 'right',
        message: intl.formatMessage({
          id: 'admin/pages.editor.styles.edit.save.successful',
        }),
      })
    } else {
      showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage({
          id: 'admin/pages.editor.styles.edit.save.failed',
        }),
      })
    }
  }

  const onSave = () => {
    setEditing(false)
    saveStyle()
  }

  const getStyleEditorToolsProps = (
    data: GenerateStyleSheetData | undefined
  ) => ({
    data: data || null,
    hooks,
    onSave,
    setStyleAsset,
    stopEditing,
  })

  return (
    <GenerateStyleSheetQuery
      variables={{ config }}
      fetchPolicy={'network-only'}
    >
      {({ data }) => <StyleEditorRouter {...getStyleEditorToolsProps(data)} />}
    </GenerateStyleSheetQuery>
  )
}

export default injectIntl(StyleEditorStates)
