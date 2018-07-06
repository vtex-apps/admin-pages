import PropTypes from 'prop-types'
import React from 'react'
import { Tabs, Tab } from 'vtex.styleguide'

const ModeSwitcher = ({ activeMode, modes, onSwitch }) => (
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

ModeSwitcher.defaultProps = {
  modes: [],
}

ModeSwitcher.propTypes = {
  activeMode: PropTypes.string.isRequired,
  modes: PropTypes.arrayOf(PropTypes.string),
  onSwitch: PropTypes.func.isRequired,
}

export default ModeSwitcher
