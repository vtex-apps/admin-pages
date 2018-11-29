import React from 'react'

import Mode from './Mode'

interface Props {
  editor: EditorContext
}

const modes: EditorMode[] = ['content', 'layout']

const ModeSwitcher = ({ editor }: Props) => (
  <div className="pt5">
    {modes.map(current => (
      <Mode
        key={current}
        mode={editor.mode}
        setMode={editor.setMode}
        type={current}
      />
    ))}
  </div>
)

export default ModeSwitcher
