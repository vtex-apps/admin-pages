import { mergeDeepRight } from 'ramda'
import React, { useReducer, useState } from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'
import { ToastConsumer } from 'vtex.styleguide'

import Colors from '../components/Colors'
import ColorsEditor from './ColorsEditor'
import GenerateStyleSheet from './queries/GenerateStyleSheet.graphql'
import RenameStyle from './queries/RenameStyle.graphql'
import UpdateStyle from './queries/UpdateStyle.graphql'

import StyleEditorTools from './StyleEditorTools'

type EditMode = 'colors' | undefined

interface Props {
  style: Style
  stopEditing: () => void
  setStyleAsset: (asset: StyleAssetInfo) => void
}

interface EditorProps {
  config: TachyonsConfig
  addNavigation: (info: NavigationInfo) => void
  updateConfig: React.Dispatch<Partial<TachyonsConfig>>
  setStyleAsset: (asset: StyleAssetInfo) => void
}

interface UpdateStyleResult {
  updateStyle: {
    path: string
    selected: boolean
  }
}

type ConfigReducer = (
  config: TachyonsConfig,
  partialConfig: Partial<TachyonsConfig>
) => TachyonsConfig

const Editor: React.SFC<EditorProps> = ({
  addNavigation,
  config,
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
    <Query query={GenerateStyleSheet} variables={{ config }}>
      {({ data }: QueryResult<{ generateStyleSheet: string }>) => {
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
                        text: 'Back',
                      },
                      title: 'Colors',
                    })
                    setMode('colors')
                  }}
                >
                  <span className="f4">Colors</span>
                  <Colors colors={[emphasis, action_primary]} />
                </div>
              </div>
            )
        }
      }}
    </Query>
  )
}

const StyleEditor: React.SFC<Props> = ({
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
    <Mutation mutation={RenameStyle}>
      {renameStyle => (
        <Mutation mutation={UpdateStyle}>
          {(updateStyle: MutationFn<UpdateStyleResult>) => (
            <ToastConsumer>
              {({ showToast }) => (
                <StyleEditorTools
                  initialState={{
                    backButton: {
                      action: stopEditing,
                      text: 'Back',
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
                        horizontalPosition: 'right',
                        message: 'Style saved successfully.',
                      })
                    } else {
                      showToast({
                        horizontalPosition: 'right',
                        message: 'There was a problem saving your style.',
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
                    />
                  )}
                </StyleEditorTools>
              )}
            </ToastConsumer>
          )}
        </Mutation>
      )}
    </Mutation>
  )
}

export default StyleEditor
