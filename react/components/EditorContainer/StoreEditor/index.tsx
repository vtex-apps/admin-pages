import React from 'react'

interface Props {
  editor: EditorContext
  mode: StoreEditMode
}

const StoreEditor: React.SFC<Props> = ({ mode }) => {
  return (
    <div
      className="h-100 mr5 bg-base ba b--muted-4 br3"
      style={{
        width: '32rem',
      }}
    />
  )
}

export default StoreEditor
