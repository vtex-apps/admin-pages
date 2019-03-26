import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Textarea } from 'vtex.styleguide'

interface Props extends WidgetProps {
  autofocus: boolean
  label?: string
  rawErrors?: string[]
  onChange(val: string): void
}

/*
 * onBlur and onFocus are typed wrong on react-jsonschema-form, it should be:
 * - onBlur: (id: string, value: string) => void
 * - onFocus: (id: string, value: string) => void
 * (source: https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#custom-widgets-and-fields)
 * instead of:
 * - onBlur: FocusEventHandler<HTMLTextAreaElement>
 * - onFocus: FocusEventHandler<HTMLTextAreaElement>
 */

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

  return (
    <Textarea
      autoFocus={autofocus}
      error={!!currentError}
      errorMessage={currentError}
      helpText={schema.description}
      onChange={({ target }) => onChange(target.value || '')}
      onBlur={onBlur && (event => (onBlur as any)(id, event.target.value))}
      onFocus={onFocus && (event => (onFocus as any)(id, event.target.value))}
      readOnly={readonly}
      value={value}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}

export default TextArea
