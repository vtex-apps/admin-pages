import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'vtex.styleguide'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

const BaseInput = props => {
  const {
    autofocus,
    disabled,
    id,
    label,
    max,
    min,
    onBlur,
    onFocus,
    options,
    placeholder,
    rawErrors,
    readonly,
    required,
    schema,
    value,
    intl,
  } = props

  const schemaType = schema.type === 'number' ? 'number' : 'text'

  const type = options.inputType || props.type || schemaType

  const currentError = rawErrors[0]

  const _onChange = ({ target: { value } }) =>
    props.onChange(value || '')

  return (
    <Input
      autoFocus={autofocus}
      disabled={disabled || schema.disabled}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      label={<FormattedMessage id={label} />}
      max={max && `${max}`}
      min={min && `${min}`}
      onBlur={onBlur && (event => onBlur(id, event.target.value))}
      onChange={_onChange}
      onFocus={onFocus && (event => onFocus(id, event.target.value))}
      placeholder={placeholder}
      readOnly={readonly || schema.readonly}
      required={required}
      type={type}
      value={value && `${value}`}
    />
  )
}

BaseInput.defaultProps = {
  autofocus: false,
  disabled: false,
  placeholder: '',
  rawErrors: [],
  readonly: false,
  required: false,
}

BaseInput.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  rawErrors: PropTypes.arrayOf(PropTypes.string),
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  intl: intlShape.isRequired,
}

export default injectIntl(BaseInput)
