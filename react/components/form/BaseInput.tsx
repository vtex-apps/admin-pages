import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Input } from 'vtex.styleguide'

import { CustomWidgetProps } from './typings'

interface Props extends CustomWidgetProps, InjectedIntlProps {
  label: string
  max?: number
  min?: number
  rawErrors?: string[]
  type?: string
  schema: CustomWidgetProps['schema'] & {
    readonly?: boolean
  }
}

const BaseInput: React.FunctionComponent<Props> = props => {
  const {
    disabled,
    id,
    intl,
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
  } = props

  const schemaType = schema.type === 'number' ? 'number' : 'text'

  const type = options.inputType || props.type || schemaType

  const currentError = rawErrors && rawErrors[0]

  const onChange = ({
    target: { value: inputValue },
  }: React.ChangeEvent<HTMLInputElement>) => props.onChange(inputValue || '')

  return (
    <Input
      disabled={disabled || schema.disabled}
      error={!!currentError}
      errorMessage={currentError}
      helpText={
        schema.description
          ? formatIOMessage({ id: schema.description, intl })
          : ''
      }
      label={formatIOMessage({ id: label, intl })}
      max={max ? `${max}` : undefined}
      min={min ? `${min}` : undefined}
      onBlur={
        onBlur &&
        ((event: React.ChangeEvent<HTMLInputElement>) =>
          onBlur(id, event.target.value))
      }
      onChange={onChange}
      onFocus={
        onFocus &&
        ((event: React.ChangeEvent<HTMLInputElement>) =>
          onFocus(id, event.target.value))
      }
      placeholder={placeholder}
      readOnly={readonly || schema.readonly}
      required={required}
      type={type}
      value={value ? `${value}` : ''}
    />
  )
}

BaseInput.defaultProps = {
  disabled: false,
  placeholder: '',
  rawErrors: [],
  readonly: false,
  required: false,
}

export default injectIntl(BaseInput)
