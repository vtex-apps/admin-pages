import { mergeDeepRight } from 'ramda'
import React, { useReducer, useState } from 'react'
import { defineMessages, InjectedIntl, injectIntl } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import Colors from '../components/Colors'
import ColorsEditor from './ColorsEditor'

import RenameStyleMutation from './mutations/RenameStyle'
import UpdateStyleMutation from './mutations/UpdateStyle'
import GenerateStyleSheetQuery from './queries/GenerateStyleSheet'

import StyleEditorTools from './StyleEditorTools'

type EditMode = 'colors' | undefined

interface Props {
  intl: InjectedIntl
  setStyleAsset: (asset: StyleAssetInfo) => void
  stopEditing: () => void
  style: Style
}

interface EditorProps {
  addNavigation: (info: NavigationInfo) => void
  config: TachyonsConfig
  intl: InjectedIntl
  setStyleAsset: (asset: StyleAssetInfo) => void
  updateConfig: React.Dispatch<Partial<TachyonsConfig>>
}

const messages = defineMessages({
  back: {
    defaultMessage: 'Back',
    id: 'admin/pages.editor.styles.color-editor.back',
  },
  colorsBack: {
    defaultMessage: 'Back',
    id: 'admin/pages.editor.styles.edit.colors.back',
  },
  saveFailed: {
    defaultMessage: 'There was a problem saving your style.',
    id: 'admin/pages.editor.styles.edit.save.failed',
  },
  saveSuccessful: {
    defaultMessage: 'Style saved successfully.',
    id: 'admin/pages.editor.styles.edit.save.successful',
  },
  title: {
    defaultMessage: 'Colors',
    id: 'admin/pages.editor.styles.edit.colors.title',
  },
})

type ConfigReducer = (
  config: TachyonsConfig,
  partialConfig: Partial<TachyonsConfig>
) => TachyonsConfig

const Editor: React.FunctionComponent<EditorProps> = ({
  addNavigation,
  config,
  intl,
  updateConfig,
  setStyleAsset,
}) => {
  const [mode, setMode] = useState<EditMode>(undefined)

  const {
    typography: {
      styles: { heading_6 },
    },
    semanticColors,
    semanticColors: {
      background: { emphasis, action_primary },
    },
  } = config

  return (
    <GenerateStyleSheetQuery
      variables={{ config }}
      fetchPolicy={'network-only'}
    >
      {({ data }) => {
        const stylesheet = data && data.generateStyleSheet

        if (stylesheet) {
          setStyleAsset({ type: 'stylesheet', value: stylesheet })
        }

        switch (mode) {
          case 'colors':
            return (
              <ColorsEditor
                font={heading_6}
                semanticColors={semanticColors}
                updateStyle={updateConfig}
                addNavigation={addNavigation}
              />
            )
          default:
            return (
              <div className="ph6">
                <div
                  className="pointer flex justify-between items-center pv6 bb b--muted-4"
                  onClick={() => {
                    addNavigation({
                      backButton: {
                        action: () => setMode(undefined),
                        text: intl.formatMessage(messages.back),
                      },
                      title: intl.formatMessage(messages.title),
                    })
                    setMode('colors')
                  }}
                >
                  <span className="f4">
                    {intl.formatMessage(messages.title)}
                  </span>
                  <Colors colors={[emphasis, action_primary]} />
                </div>
              </div>
            )
        }
      }}
    </GenerateStyleSheetQuery>
  )
}

const StyleEditor: React.FunctionComponent<Props> = ({
  intl,
  stopEditing,
  style,
  setStyleAsset,
}) => {
  const [config, updateConfig] = useReducer<ConfigReducer>(
    mergeDeepRight as ConfigReducer,
    style.config
  )
  const [name, setName] = useState<string>(style.name)

  return (
    <RenameStyleMutation>
      {renameStyle => (
        <UpdateStyleMutation>
          {updateStyle => (
            <ToastConsumer>
              {({ showToast }) => (
                <StyleEditorTools
                  initialState={{
                    backButton: {
                      action: stopEditing,
                      text: intl.formatMessage(messages.colorsBack),
                    },
                    title: name,
                  }}
                  saveStyle={async () => {
                    await renameStyle({ variables: { id: style.id, name } })
                    const result = await updateStyle({
                      variables: { id: style.id, config },
                    })
                    const styleInfo =
                      result && result.data && result.data.updateStyle
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
                        message: intl.formatMessage(messages.saveSuccessful),
                      })
                    } else {
                      showToast({
                        horizontalPosition: 'left',
                        message: intl.formatMessage(messages.saveFailed),
                      })
                    }
                  }}
                  setName={setName}
                >
                  {updateNavigation => (
                    <Editor
                      config={config}
                      updateConfig={updateConfig}
                      addNavigation={(info: NavigationInfo) => {
                        updateNavigation({ info, type: 'push' })
                      }}
                      setStyleAsset={setStyleAsset}
                      intl={intl}
                    />
                  )}
                </StyleEditorTools>
              )}
            </ToastConsumer>
          )}
        </UpdateStyleMutation>
      )}
    </RenameStyleMutation>
  )
}

export default injectIntl(StyleEditor)
