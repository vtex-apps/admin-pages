import React from 'react'
import PropTypes from 'prop-types'
import StyleguideDropdown from '@vtex/styleguide/lib/Dropdown'

const getChangeHandler = (onChange, emptyValue) => ({ target: { value } }) =>
  onChange(!value ? emptyValue : value)

const Dropdown = ({
  autofocus,
  disabled,
  id,
  onChange,
  onClose,
  onOpen,
  options,
  placeholder,
  readonly,
  value,
}) => {
  return (
    <StyleguideDropdown
      autoFocus={autofocus}
      disabled={disabled}
      id={id}
      label=""
      onChange={onChange && getChangeHandler(onChange, options.emptyValue)}
      onClose={onClose}
      onOpen={onOpen}
      options={options.enumOptions}
      placeholder={placeholder}
      readOnly={readonly}
      value={value || ''}
    />
  )
}

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
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  options: PropTypes.object,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.any,
}

export default Dropdown
