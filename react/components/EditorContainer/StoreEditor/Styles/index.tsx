import React, { useState } from 'react'

import StyleEditor from './StyleEditor'
import StyleList from './StyleList'

interface Props {
  iframeWindow: Window
}

type EditingState = Style | undefined

const Styles: React.SFC<Props> = ({ iframeWindow }) => {
  const [editing, setEditing] = useState<EditingState>(undefined)

  return editing ? (
    <StyleEditor
      iframeWindow={iframeWindow}
      style={editing}
      stopEditing={() => setEditing(undefined)}
    />
  ) : (
    <StyleList iframeWindow={iframeWindow} startEditing={setEditing} />
  )
}

export default Styles
