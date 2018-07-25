import React from 'react'
import { Textarea } from 'vtex.styleguide'

const TextArea = (props) => {
  const {
    /* eslint-disable react/prop-types */
    autofocus,
    schema,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    readonly,
    value,
    label,
    disabled,
    id,
    rawErrors,
    /* eslint-enable react/prop-types */
  } = props

  const [currentError] = Array.isArray(rawErrors) ? rawErrors : []

  const handleChange = ({ target: { value } }) =>
    onChange(value || '')

  return (
    <Textarea
      autofocus={autofocus}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      onChange={handleChange}
      onBlue={onBlur && (event => onBlur(id, event.target.value))}
      onFocus={onFocus && (event => onFocus(id, event.target.value))}
      readOnly={readonly}
      value={value}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}

TextArea.propTypes = {
}

export default TextArea
