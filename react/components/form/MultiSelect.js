import React, { Fragment } from 'react'
import ReactSelect from 'react-select'
import PropTypes from 'prop-types'

const getChangeHandler = onChange => value => {
  const formattedValue = value.map(item => item.value)

  return onChange(formattedValue)
}

const MultiSelect = ({
  autofocus,
  disabled,
  id,
  label,
  onChange,
  options: { enumOptions },
  placeholder,
  schema,
  value,
}) => (
  <Fragment>
    {(label || (schema && schema.title)) && (
      <label>
        <span className="dib mb3 w-100">
          <span>{label || schema.title}</span>
        </span>
      </label>
    )}
    <ReactSelect
      autoFocus={autofocus}
      disabled={disabled || (schema && schema.disabled) || enumOptions.length === 0}
      id={id}
      multi
      onChange={getChangeHandler(onChange)}
      options={enumOptions}
      placeholder={placeholder}
      value={value}
    />
  </Fragment>
)

MultiSelect.defaultProps = {
  autofocus: false,
  disabled: false,
  placeholder: '',
  value: [],
}

MultiSelect.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.shape({
    enumOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  placeholder: PropTypes.string,
  schema: PropTypes.shape({
    disabled: PropTypes.bool,
    title: PropTypes.string.isRequired
  }),
  value: PropTypes.arrayOf(PropTypes.string),
}

export default MultiSelect
