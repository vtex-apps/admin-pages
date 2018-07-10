import React from 'react'
import { Tabs, Tab } from 'vtex.styleguide'

interface ModeSwitcherProps {
  activeMode: string
  modes: string[]
  onSwitch: (mode: string) => void
}

const ModeSwitcher = ({ activeMode, modes = [], onSwitch }: ModeSwitcherProps) => (
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
