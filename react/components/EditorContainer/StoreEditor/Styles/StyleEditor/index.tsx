import { mergeDeepRight } from 'ramda'
import React, { useEffect, useReducer, useState } from 'react'
import { Mutation, Query, QueryResult } from 'react-apollo'

import Colors from '../components/Colors'
import ColorsEditor from './ColorsEditor'
import GenerateStyleSheet from './queries/GenerateStyleSheet.graphql'
import UpdateStyle from './queries/UpdateStyle.graphql'

import StyleEditorTools from './StyleEditorTools'

const STYLE_TAG_ID = 'style_edit'

type EditMode = 'colors' | undefined

interface Props {
  iframeWindow: Window
  style: Style
  stopEditing: () => void
}

interface EditorProps {
  iframeWindow: Window
  config: TachyonsConfig
  addNavigation: (info: NavigationInfo) => void
  updateConfig: React.Dispatch<Partial<TachyonsConfig>>
}

type ConfigReducer = (
  config: TachyonsConfig,
  partialConfig: Partial<TachyonsConfig>
) => TachyonsConfig

const Editor: React.SFC<EditorProps> = ({
  addNavigation,
  config,
  iframeWindow,
  updateConfig,
}) => {
  const [mode, setMode] = useState<EditMode>(undefined)

  useEffect(() => {
    const styleTag = iframeWindow.document.createElement('style')
    styleTag.setAttribute('id', STYLE_TAG_ID)
    if (iframeWindow.document.head) {
      iframeWindow.document.head.append(styleTag)
    }

    return () => {
      if (styleTag && iframeWindow.document.head) {
        iframeWindow.document.head.removeChild(styleTag)
      }
    }
  }, [])

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
      {({ loading, data }: QueryResult<{ generateStyleSheet: string }>) => {
        const stylesheet = (data && data.generateStyleSheet) || ''

        const styleTag = iframeWindow.document.getElementById(STYLE_TAG_ID)
        if (styleTag) {
          styleTag.innerHTML = stylesheet
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
  iframeWindow,
  stopEditing,
  style,
}) => {
  const [config, updateConfig] = useReducer<ConfigReducer>(
    mergeDeepRight as ConfigReducer,
    style.config
  )
  const [name, setName] = useState<string>(style.name)

  return (
    <Mutation mutation={UpdateStyle}>
      {updateStyle => (
        <StyleEditorTools
          initialState={{
            backButton: {
              action: stopEditing,
              text: 'Back',
            },
            title: name,
          }}
          saveStyle={() => updateStyle({ variables: { id: style.id, config } })}
        >
          {updateNavigation => (
            <Editor
              config={config}
              updateConfig={updateConfig}
              addNavigation={(info: NavigationInfo) => {
                updateNavigation({ info, type: 'push' })
              }}
              iframeWindow={iframeWindow}
            />
          )}
        </StyleEditorTools>
      )}
    </Mutation>
  )
}

export default StyleEditor
