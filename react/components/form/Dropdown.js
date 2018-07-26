import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown as StyleguideDropdown } from 'vtex.styleguide'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

const getChangeHandler = (onChange, emptyValue) => ({ target: { value } }) =>
  onChange(!value ? emptyValue : value)

const Dropdown = ({
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
  intl,
}) => (
  <StyleguideDropdown
    autoFocus={autofocus}
    disabled={disabled || (schema && schema.disabled)}
    id={id}
    label={label && intl.formatMessage({ id: label })}
    onChange={onChange && getChangeHandler(onChange, options.emptyValue)}
    onClose={onClose}
    onOpen={onOpen}
    options={
      options.enumOptions.map(option=>({
        ...option,
        label: intl.formatMessage({id: option.label}),
      }))
    }
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
  intl: intlShape.isRequired,
}

export default injectIntl(Dropdown)
