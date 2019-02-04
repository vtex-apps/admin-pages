import React from 'react'
import { Textarea } from 'vtex.styleguide'

const TextArea = (props: any) => {
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

  const [currentError] = Array.isArray(rawErrors) ? rawErrors : [] as any

  const handleChange = ({ target: { value: targetValue } }: any) =>
    onChange(targetValue || '')

  return (
    <Textarea
      autofocus={autofocus}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      onChange={handleChange}
      onBlue={onBlur && ((event: any) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event: any) => onFocus(id, event.target.value))}
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
