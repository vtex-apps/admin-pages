import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'

import { CustomWidgetProps } from './typings'

interface Props extends CustomWidgetProps, InjectedIntlProps {
  onClose?: () => void
  onOpen?: () => void
  options: { [key: string]: boolean | number | string | object | null }
}

const Dropdown: React.FunctionComponent<Props> = ({
  autofocus,
  disabled,
  id,
  intl,
  label,
  onChange,
  onClose,
  onOpen,
  options,
  placeholder,
  readonly,
  schema,
  value,
}) => {
  const handleChange = React.useCallback(
    ({
      target: { value: optionValue },
    }: React.ChangeEvent<HTMLSelectElement>) =>
      onChange(!optionValue ? options.emptyValue : optionValue),
    []
  )

  const dropdownOptions = React.useMemo(
    () =>
      Array.isArray(options.enumOptions)
        ? options.enumOptions.map(option => ({
            ...option,
            label: formatIOMessage({ id: `${option.label}`, intl }),
          }))
        : [],
    [options.enumOptions]
  )

  return (
    <StyleguideDropdown
      autoFocus={autofocus}
      disabled={disabled || (schema && schema.disabled)}
      id={id}
      label={formatIOMessage({ id: label, intl })}
      onChange={handleChange}
      onClose={onClose}
      onOpen={onOpen}
      options={dropdownOptions}
      placeholder={
        placeholder ? formatIOMessage({ id: placeholder, intl }) : ''
      }
      readOnly={readonly}
      value={value}
    />
  )
}

Dropdown.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
  required: false,
  value: '',
}

export default injectIntl(Dropdown)
