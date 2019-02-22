import React, { useEffect, useState } from 'react'

import StyleEditor from './StyleEditor'
import StyleList from './StyleList'

const SELECTED_STYLE_TAG_ID = 'style_link'
const PATH_STYLE_TAG_ID = 'style_path'
const SHEET_STYLE_TAG_ID = 'style_sheet'

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
    if (asset.selected) {
      const selectedStyleTag = window.document.getElementById(
        SELECTED_STYLE_TAG_ID
      )
      if (selectedStyleTag) {
        selectedStyleTag.setAttribute('href', asset.value)
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
    const stylePathTag = iframeWindow.document.createElement('style')
    stylePathTag.setAttribute('id', PATH_STYLE_TAG_ID)
    if (iframeWindow.document.head) {
      iframeWindow.document.head.append(stylePathTag)
    }

    const styleSheetTag = iframeWindow.document.createElement('style')
    styleSheetTag.setAttribute('id', SHEET_STYLE_TAG_ID)
    if (iframeWindow.document.head) {
      iframeWindow.document.head.append(styleSheetTag)
    }

    return () => {
      if (stylePathTag && iframeWindow.document.head) {
        try {
          iframeWindow.document.head.removeChild(stylePathTag)
        } catch (err) {
          console.error(err)
        }
      }
      if (styleSheetTag && iframeWindow.document.head) {
        try {
          iframeWindow.document.head.removeChild(styleSheetTag)
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
