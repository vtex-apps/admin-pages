import React from 'react'
import { Tab, Tabs } from 'vtex.styleguide'

interface Props {
  editor: EditorContext
}

const ModeSwitcher = ({ editor: {mode, setMode} }: Props) => (
  <Tabs fullWidth>
    {['content', 'layout'].map(current => (
      <Tab
        active={mode === current}
        key={current}
        label={current.toUpperCase()}
        onClick={() => setMode(current as EditorMode)}
      />
    ))}
  </Tabs>
)

export default ModeSwitcher
