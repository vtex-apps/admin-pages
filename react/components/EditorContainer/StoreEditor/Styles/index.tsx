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

const createStyleTag = (window: Window, id: string) => {
  if (window.document.getElementById(id)) {
    return
  }
  const styleTag = window.document.createElement('style')
  styleTag.setAttribute('id', id)
  const tachyonsTag = window.document.getElementById('style_link')
  if (tachyonsTag) {
    tachyonsTag.after(styleTag)
  } else if (window.document.head) {
    window.document.head.append(styleTag)
  }
}

const removeStyleTag = (window: Window, id: string) => {
  const styleTag = window.document.getElementById(id)
  if (styleTag && window.document.head) {
    try {
      window.document.head.removeChild(styleTag)
    } catch (err) {
      console.error(err)
    }
  }
}

const Styles: React.FunctionComponent<Props> = ({ iframeWindow }) => {
  const [editing, setEditing] = useState<EditingState>(undefined)

  useEffect(
    () => {
      createStyleTag(iframeWindow, PATH_STYLE_TAG_ID)
      createStyleTag(iframeWindow, SHEET_STYLE_TAG_ID)

      return () => {
        removeStyleTag(iframeWindow, PATH_STYLE_TAG_ID)
        removeStyleTag(iframeWindow, SHEET_STYLE_TAG_ID)
      }
    },
    [editing]
  )

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
