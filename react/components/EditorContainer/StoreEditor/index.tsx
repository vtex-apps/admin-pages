import React from 'react'

import Store from './Store'
import Styles from './Styles'

interface Props {
  editor: EditorContext
  mode: StoreEditMode
  visible?: boolean
}

const Mode = ({ editor, mode }: Props) => {
  switch (mode) {
    case 'theme':
      return <Styles iframeWindow={editor.iframeWindow} />
    case 'settings':
      return <Store />
  }
}

const StoreEditor: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div
      className={`h-100 mr5 bg-base ba b--muted-4 br3${
        props.visible ? '' : ' dn'
      }`}
      style={{
        minWidth: '31rem',
        width: '31rem',
      }}
    >
      {Mode(props)}
    </div>
  )
}

export default StoreEditor
