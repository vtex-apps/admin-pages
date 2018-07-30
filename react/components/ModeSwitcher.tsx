import React from 'react'
import { Tabs, Tab } from 'vtex.styleguide'

type Props = {
  activeMode: ComponentEditorMode
  modes: ComponentEditorMode[]
  onSwitch: (newMode: ComponentEditorMode) => void
}

const ModeSwitcher = ({ activeMode, modes = [], onSwitch }: Props) => (
  <Tabs fullWidth>
    {modes.map(mode => (
      <Tab
        active={mode === activeMode}
        key={mode}
        label={mode.toUpperCase()}
        onClick={() => onSwitch(mode)}
      />
    ))}
  </Tabs>
)

export default ModeSwitcher
