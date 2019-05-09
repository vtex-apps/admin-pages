import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Textarea } from 'vtex.styleguide'

interface Props extends InjectedIntlProps, WidgetProps {
  autofocus: boolean
  label: string
  rawErrors?: string[]
  onChange(val: string): void
}

const TextArea: React.FunctionComponent<Props> = ({
  autofocus,
  disabled,
  id,
  intl,
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
  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (onBlur) {
        onBlur(id, event.target.value)
      }
    },
    []
  )

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value || '')
    },
    []
  )

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (onFocus) {
        onFocus(id, event.target.value)
      }
    },
    []
  )

  const [currentError] = Array.isArray(rawErrors) ? rawErrors : ['']

  return (
    <Textarea
      autoFocus={autofocus}
      disabled={disabled}
      error={!!currentError}
      errorMessage={currentError}
      helpText={
        schema.description
          ? formatIOMessage({ id: schema.description, intl })
          : ''
      }
      label={formatIOMessage({ id: label, intl })}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={
        placeholder ? formatIOMessage({ id: placeholder, intl }) : ''
      }
      readOnly={readonly}
      value={value}
    />
  )
}

export default injectIntl(TextArea)
