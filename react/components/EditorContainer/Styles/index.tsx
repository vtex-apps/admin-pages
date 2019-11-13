import React, { useEffect, useState } from 'react'

import { useEditorContext } from '../../EditorContext'

import StyleEditor from './StyleEditor'
import StyleList from './StyleList'

const SELECTED_STYLE_TAG_ID = 'style_link'
const PATH_STYLE_TAG_ID = 'style_path'
const SHEET_STYLE_TAG_ID = 'style_sheet'

type EditingState = Style | undefined

const setStyleAsset = (window?: Window) => (asset: StyleAssetInfo) => {
  if (!window) {
    return
  }

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

const createStyleTag = (id: string, window?: Window) => {
  if (!window || window.document.getElementById(id)) {
    return
  }
  const styleTag = window.document.createElement('style')
  styleTag.setAttribute('id', id)
  const tachyonsTag = window.document.getElementById('style_link')
  if (tachyonsTag) {
    tachyonsTag.after(styleTag)
  }
}

const removeStyleTag = (id: string, window?: Window) => {
  if (!window) {
    return
  }

  const styleTag = window.document.getElementById(id)
  if (styleTag && window.document.head) {
    try {
      window.document.head.removeChild(styleTag)
    } catch (err) {
      console.error(err)
    }
  }
}

const Styles = () => {
  const [editing, setEditing] = useState<EditingState>(undefined)

  const { iframeWindow } = useEditorContext()

  useEffect(() => {
    createStyleTag(PATH_STYLE_TAG_ID, iframeWindow)
    createStyleTag(SHEET_STYLE_TAG_ID, iframeWindow)

    return () => {
      removeStyleTag(PATH_STYLE_TAG_ID, iframeWindow)
      removeStyleTag(SHEET_STYLE_TAG_ID, iframeWindow)
    }
  }, [editing, iframeWindow])

  return (
    <div
      className="h-100 mr5 bg-base ba b--muted-4 br3"
      style={{
        minWidth: '31rem',
        width: '31rem',
      }}
    >
      {editing ? (
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
      )}
    </div>
  )
}

export default Styles
