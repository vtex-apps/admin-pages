import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Textarea } from 'vtex.styleguide'

import { CustomWidgetProps } from './typings'

type Props = CustomWidgetProps & InjectedIntlProps

const TextArea: React.FunctionComponent<Props> = ({
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
    [id, onBlur]
  )

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value || '')
    },
    [onChange]
  )

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (onFocus) {
        onFocus(id, event.target.value)
      }
    },
    [id, onFocus]
  )

  const [currentError] = Array.isArray(rawErrors) ? rawErrors : ['']

  return (
    <Textarea
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
      resize="vertical"
      value={value ? `${value}` : ''}
    />
  )
}

export default injectIntl(TextArea)
