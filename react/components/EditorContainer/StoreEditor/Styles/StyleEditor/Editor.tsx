import React, { useState } from 'react'

import { GenerateStyleSheetData } from './queries/GenerateStyleSheet'

import ColorsEditor from './ColorsEditor'
import EditorSelector from './EditorSelector'

export type EditMode = 'colors' | undefined

interface Props {
  addNavigation: (info: NavigationInfo) => void
  config: TachyonsConfig
  data: GenerateStyleSheetData | null
  setStyleAsset: (asset: StyleAssetInfo) => void
  updateConfig: React.Dispatch<Partial<TachyonsConfig>>
}

const Editor: React.FunctionComponent<Props> = ({
  addNavigation,
  config,
  data,
  setStyleAsset,
  updateConfig,
}) => {
  const [mode, setMode] = useState<EditMode>(undefined)

  const {
    typography: {
      styles: { heading_6 },
    },
    semanticColors,
  } = config

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
      return <EditorSelector {...{ addNavigation, config, setMode }} />
  }
}

export default Editor
