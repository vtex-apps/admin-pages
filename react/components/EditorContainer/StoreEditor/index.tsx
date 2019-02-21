import React from 'react'

import Styles from './Styles'

interface Props {
  editor: EditorContext
  mode: StoreEditMode
}

const Mode = ({ editor, mode }: Props) => {
  switch (mode) {
    case 'theme':
      return <Styles iframeWindow={editor.iframeWindow} />
  }
}

const StoreEditor: React.SFC<Props> = (props: Props) => {
  return (
    <div
      className="h-100 mr5 bg-base ba b--muted-4 br3"
      style={{
        width: '32rem',
      }}
    >
      {Mode(props)}
    </div>
  )
}

export default StoreEditor
