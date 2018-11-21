import PropTypes from 'prop-types'
import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'
import SimpleFormattedMessage from './SimpleFormattedMessage'

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

type DropdownProps = WidgetProps & Props

const getChangeHandler = (
  onChange: (value?: string) => void,
  emptyValue?: string,
) => ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) =>
  onChange(!value ? emptyValue : value)

const Dropdown: React.SFC<DropdownProps> = ({
  autofocus,
  disabled,
  id,
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
    label={label && <SimpleFormattedMessage id={label} />}
    onChange={onChange && getChangeHandler(onChange, options.emptyValue)}
    onClose={onClose}
    onOpen={onOpen}
    options={options.enumOptions.map(option => ({
      ...option,
      label: option.label && <SimpleFormattedMessage id={option.label} />,
    }))}
    placeholder={placeholder}
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

Dropdown.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  options: PropTypes.object,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    disabled: PropTypes.bool,
  }),
  value: PropTypes.any,
}

export default Dropdown
