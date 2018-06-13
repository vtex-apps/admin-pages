import PropTypes from 'prop-types'
import React from 'react'

const ModeSwitcher = ({ activeMode, modes, onSwitch }) => (
  <div className="h3 flex justify-center bt bb bw1 b--light-gray">
    {modes.map(mode => (
      <div
        className={`w-50 flex items-center justify-center bg-near-white hover-bg-light-silver pointer bb bw2 ${
          activeMode === mode
            ? 'b--blue'
            : 'b--near-white hover-b--light-silver'
          }`}
        key={mode}
        onClick={() => onSwitch(mode)}
      >
        {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </div>
    ))}
  </div>
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
