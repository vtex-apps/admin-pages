import React, { Fragment } from 'react'

import Select from '../Select'

interface Props {
  autofocus?: boolean
  disabled?: boolean
  id?: string
  label?: string
  onChange: (newValue: SelectOption[]) => void
  options: {
    enumOptions: SelectOption[]
  }
  placeholder: string
  schema?: {
    disabled?: boolean
    title: string
  }
  value: SelectOption[]
}

const MultiSelect: React.SFC<Props> = ({
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
          <span>{label || (schema && schema.title)}</span>
        </span>
      </label>
    )}
    <Select
      autoFocus={autofocus}
      isDisabled={
        disabled || (schema && schema.disabled) || enumOptions.length === 0
      }
      id={id}
      isMulti
      onChange={(optionValues?: SelectOption | SelectOption[] | null) => {
        onChange(optionValues as SelectOption[])
      }}
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

export default MultiSelect
