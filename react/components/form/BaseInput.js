import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'vtex.styleguide'

const BaseInput = props => {
  const {
    autofocus,
    disabled,
    id,
    label,
    onBlur,
    onFocus,
    options,
    readonly,
    required,
    schema,
    value,
  } = props

  const schemaType = schema.type === 'number' ? 'number' : 'text'

  const type = options.inputType || props.type || schemaType

  const _onChange = ({ target: { value } }) =>
    props.onChange(value || '')

  return (
    <Input
      autoFocus={autofocus}
      disabled={disabled}
      helpText={schema.description}
      label={label}
      onBlur={onBlur && (event => onBlur(id, event.target.value))}
      onChange={_onChange}
      onFocus={onFocus && (event => onFocus(id, event.target.value))}
      readOnly={readonly}
      required={required}
      type={type}
      value={value}
    />
  )
}

BaseInput.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
  required: false,
}

BaseInput.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
}

export default BaseInput
