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
}

const BaseInput: React.FunctionComponent<Props> = props => {
  const {
    autofocus,
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

  const type = (options as any).inputType || props.type || schemaType

  const currentError = rawErrors && rawErrors[0]

  const onChange = ({
    target: { value: inputValue },
  }: React.ChangeEvent<HTMLInputElement>) => props.onChange(inputValue || '')

  return (
    <Input
      autoFocus={autofocus}
      disabled={disabled || (schema as any).disabled}
      error={!!currentError}
      errorMessage={currentError}
      helpText={
        schema.description
          ? formatIOMessage({ id: schema.description, intl })
          : ''
      }
      label={formatIOMessage({ id: label, intl })}
      max={max && `${max}`}
      min={min && `${min}`}
      onBlur={
        onBlur &&
        ((event: React.ChangeEvent<HTMLInputElement>) =>
          (onBlur as any)(id, event.target.value))
      }
      onChange={onChange}
      onFocus={
        onFocus &&
        ((event: React.ChangeEvent<HTMLInputElement>) =>
          (onFocus as any)(id, event.target.value))
      }
      placeholder={placeholder}
      readOnly={readonly || (schema as any).readonly}
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

export default injectIntl(BaseInput)
