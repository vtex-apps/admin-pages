import { mergeDeepRight } from 'ramda'
import React, { useReducer, useState } from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { ShowToastFunction } from 'vtex.styleguide'

import { RenameStyleFunction } from './mutations/RenameStyle'
import { UpdateStyleFunction } from './mutations/UpdateStyle'
import GenerateStyleSheetQuery, { GenerateStyleSheetData } from './queries/GenerateStyleSheet'
import StyleEditorTools from './StyleEditorTools'

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

type NavigationReducer = (
  prevState: NavigationInfo[],
  info: NavigationUpdate
) => NavigationInfo[]

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
  const initialState = {
    backButton: {
      action: stopEditing,
      text: intl.formatMessage({
        id: 'pages.editor.styles.edit.colors.back',
      }),
    },
    title: name,
  }
  const configReducer = useReducer<ConfigReducer>(
    mergeDeepRight as ConfigReducer,
    style.config
  )
  const [config] = configReducer
  const editingState = useState(false)
  const [_, setEditing] = editingState
  const navigationState = useReducer<NavigationReducer>(
    (state, update) => {
      const newInfo = update.info ? [update.info] : []
      if (update.type === 'pop' || update.type === 'push') {
        setEditing(false)
      }

      switch (update.type) {
        case 'pop':
          return state.slice(0, -1)
        case 'update':
          return [...state.slice(0, -1), ...newInfo]
        default:
          return [...state, ...newInfo]
      }
    },
    [initialState]
  )

  const hooks = {
    config: configReducer,
    editing: editingState,
    name: nameState,
    navigation: navigationState,
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
          id: 'pages.editor.styles.edit.save.successful',
        }),
      })
    } else {
      showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage({
          id: 'pages.editor.styles.edit.save.failed',
        }),
      })
    }
  }

  const getStyleEditorToolsProps = (data: GenerateStyleSheetData | undefined) => ({
    data: data || null,
    hooks,
    saveStyle,
    setStyleAsset,
  })

  return (
    <GenerateStyleSheetQuery
      variables={{ config }}
      fetchPolicy={'network-only'}
    >
      {({ data }) => <StyleEditorTools {...getStyleEditorToolsProps(data)} />}
    </GenerateStyleSheetQuery>
  )
}

export default injectIntl(StyleEditorStates)
