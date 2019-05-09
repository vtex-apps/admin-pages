import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'

interface Props {
  label?: string
  onClose?: () => void
  onOpen?: () => void
  schema: {
    disabled?: boolean
  }
  options: {
    emptyValue: string
    enumOptions: Array<{ label: string }>
  }
}

type DropdownProps = Props & WidgetProps & InjectedIntlProps

const getChangeHandler = (
  onChange: (value?: string) => void,
  emptyValue?: string
) => ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) =>
  onChange(!value ? emptyValue : value)

const Dropdown: React.FunctionComponent<DropdownProps> = ({
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
}) => (
  <StyleguideDropdown
    autoFocus={autofocus}
    disabled={disabled || (schema && schema.disabled)}
    id={id}
    label={formatIOMessage({ id: label, intl })}
    onChange={onChange && getChangeHandler(onChange, options.emptyValue)}
    onClose={onClose}
    onOpen={onOpen}
    options={options.enumOptions.map(option => ({
      ...option,
      label: formatIOMessage({ id: `${option.label}`, intl }),
    }))}
    placeholder={placeholder ? formatIOMessage({ id: placeholder, intl }) : ''}
    readOnly={readonly}
    value={value || ''}
  />
)

Dropdown.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
  required: false,
}

export default injectIntl(Dropdown)
