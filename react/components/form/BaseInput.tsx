import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Input } from 'vtex.styleguide'

interface Props extends WidgetProps {
  label: string
  max?: number
  min?: number
  rawErrors?: string[]
  type?: string
}

const BaseInput: React.FunctionComponent<Props> = ({
  autofocus,
  disabled,
  id,
  label,
  max,
  min,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  rawErrors,
  readonly,
  required,
  schema,
  type,
  value,
}) => {
  const schemaType = schema.type === 'number' ? 'number' : 'text'

  const inputType = (options as any).inputType || type || schemaType

  const currentError = rawErrors && rawErrors[0]

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(id, event.target.value)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value || '')
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(id, event.target.value)
    }
  }

  return (
    <Input
      autoFocus={autofocus}
      disabled={disabled || (schema as any).disabled}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      label={label}
      max={max && `${max}`}
      min={min && `${min}`}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      readOnly={readonly || (schema as any).readonly}
      required={required}
      type={inputType}
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

export default BaseInput
