import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Textarea } from 'vtex.styleguide'

interface Props extends WidgetProps {
  autofocus: boolean
  label: string
  rawErrors?: string[]
  onChange(val: string): void
}

const TextArea: React.FunctionComponent<Props> = ({
  autofocus,
  disabled,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  rawErrors,
  readonly,
  schema,
  value,
}) => {
  const [currentError] = Array.isArray(rawErrors) ? rawErrors : ['']

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onBlur) {
      onBlur(id, event.target.value)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value || '')
  }

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onFocus) {
      onFocus(id, event.target.value)
    }
  }

  return (
    <Textarea
      autoFocus={autofocus}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      readOnly={readonly}
      value={value}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}

export default TextArea
