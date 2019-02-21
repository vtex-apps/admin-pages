import React, { useEffect, useState } from 'react'

import StyleEditor from './StyleEditor'
import StyleList from './StyleList'

const PATH_STYLE_TAG_ID = 'style_link'
const SHEET_STYLE_TAG_ID = 'style_edit'

interface Props {
  iframeWindow: Window
}

type EditingState = Style | undefined

const setStyleAsset = (window: Window) => (asset: StyleAssetInfo) => {
  if (asset.type === 'path') {
    const pathStyleTag = window.document.getElementById(PATH_STYLE_TAG_ID)
    if (pathStyleTag) {
      pathStyleTag.setAttribute('href', asset.value)
    }
    if (!asset.keepSheet) {
      const sheetStyleTag = window.document.getElementById(SHEET_STYLE_TAG_ID)
      if (sheetStyleTag) {
        sheetStyleTag.innerHTML = ''
      }
    }
  } else {
    const sheetStyleTag = window.document.getElementById(SHEET_STYLE_TAG_ID)
    if (sheetStyleTag) {
      sheetStyleTag.innerHTML = asset.value
    }
  }
}

const Styles: React.SFC<Props> = ({ iframeWindow }) => {
  const [editing, setEditing] = useState<EditingState>(undefined)

  useEffect(() => {
    const styleTag = iframeWindow.document.createElement('style')
    styleTag.setAttribute('id', SHEET_STYLE_TAG_ID)
    if (iframeWindow.document.head) {
      iframeWindow.document.head.append(styleTag)
    }

    return () => {
      if (styleTag && iframeWindow.document.head) {
        try {
          iframeWindow.document.head.removeChild(styleTag)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }, [])

  return editing ? (
    <StyleEditor
      style={editing}
      stopEditing={() => setEditing(undefined)}
      setStyleAsset={setStyleAsset(iframeWindow)}
    />
  ) : (
    <StyleList
      startEditing={setEditing}
      setStyleAsset={setStyleAsset(iframeWindow)}
    />
  )
}

export default Styles
