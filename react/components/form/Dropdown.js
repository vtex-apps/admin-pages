import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'

const getChangeHandler = (onChange, emptyValue) => ({ target: { value } }) =>
  onChange(!value ? emptyValue : value)

const Dropdown = ({
  autofocus,
  disabled,
  id,
  label,
  onChange,
  onClose,
  onOpen,
  options,
  placeholder,
  readonly,
  value,
}) => (
  <StyleguideDropdown
    autoFocus={autofocus}
    disabled={disabled}
    id={id}
    label={label}
    onChange={onChange && getChangeHandler(onChange, options.emptyValue)}
    onClose={onClose}
    onOpen={onOpen}
    options={options.enumOptions}
    placeholder={placeholder}
    readOnly={readonly}
    value={value || ''}
  />
)

Dropdown.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
  required: false,
}

Dropdown.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  options: PropTypes.object,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.any,
}

export default Dropdown
