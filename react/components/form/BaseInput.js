import React from 'react'
import PropTypes from 'prop-types'
import Input from '@vtex/styleguide/lib/Input'

function BaseInput(props) {
  const {
    value,
    readonly,
    disabled,
    autofocus,
    label,
    onBlur,
    onFocus,
    options,
    required,
    schema,
    ...inputProps
  } = props

  const type = schema.type === 'number' ? 'number' : 'text'

  inputProps.type = options.inputType || inputProps.type || type
  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === '' ? options.emptyValue : value)
  }

  const { ...cleanProps } = inputProps
  delete cleanProps.rawErrors
  delete cleanProps.formContext

  return (
    <Input
      {...cleanProps}
      autoFocus={autofocus}
      disabled={disabled}
      helpText={schema.description}
      label={label}
      onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
      onChange={_onChange}
      onFocus={onFocus && (event => onFocus(inputProps.id, event.target.value))}
      readOnly={readonly}
      required={required}
      value={value || ''}
    />
  )
}

BaseInput.defaultProps = {
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
  label: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
}

export default BaseInput
