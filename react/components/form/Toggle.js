import React from 'react'
import PropTypes from 'prop-types'
import { Toggle as StyleguideToggle } from 'vtex.styleguide'

const Toggle = ({
  autofocus,
  disabled,
  id,
  label,
  onChange,
  readonly,
  value,
}) => (
  <StyleguideToggle
    autoFocus={autofocus}
    checked={value}
    disabled={disabled || readonly}
    id={id}
    label={label}
    onChange={event => onChange(event.target.checked)}
    size="small"
  />
)

Toggle.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
}

Toggle.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  value: PropTypes.bool,
}

export default Toggle
