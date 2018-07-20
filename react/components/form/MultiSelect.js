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
  onChange,
  options: { enumOptions },
  placeholder,
  schema: { title },
  value,
}) => (
  <Fragment>
    <label>
      <span className="dib mb3 w-100">
        <span>{title}</span>
      </span>
    </label>
    <ReactSelect
      autoFocus={autofocus}
      disabled={disabled || enumOptions.length === 0}
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
  id: PropTypes.string.isRequired,
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
    title: PropTypes.string.isRequired
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
}

export default MultiSelect
