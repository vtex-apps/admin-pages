import React from 'react'
import PropTypes from 'prop-types'

function BaseInput(props) {
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    options,
    ...inputProps
  } = props

  inputProps.type = options.inputType || inputProps.type || 'text'
  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === '' ? options.emptyValue : value)
  }

  const { ...cleanProps } = inputProps
  delete cleanProps.rawErrors
  delete cleanProps.schema
  delete cleanProps.formContext

  return (
    <input
      className="form-control w-100 br2 ba b--light-gray pa2"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={value == null ? '' : value}
      {...cleanProps}
      onChange={_onChange}
      onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
      onFocus={onFocus && (event => onFocus(inputProps.id, event.target.value))}
    />
  )
}

BaseInput.defaultProps = {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
}

BaseInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

export default BaseInput
