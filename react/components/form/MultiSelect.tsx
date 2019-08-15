import React, { Fragment } from 'react'
import ReactSelect, { Option } from 'react-select'

interface Props {
  disabled?: boolean
  id?: string
  label?: string
  onChange: (newValue: string[]) => void
  options: {
    enumOptions: Option[]
  }
  placeholder: string
  schema?: {
    disabled?: boolean
    title: string
  }
  value: string[]
}

const MultiSelect: React.FunctionComponent<Props> = ({
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
      <label htmlFor={id}>
        <span className="dib mb3 w-100">
          <span>{label || (schema && schema.title)}</span>
        </span>
      </label>
    )}
    <ReactSelect
      disabled={
        disabled || (schema && schema.disabled) || enumOptions.length === 0
      }
      id={id}
      multi
      onChange={optionValues => {
        const formattedValue = (optionValues as Option[]).map(
          (item: Option) => item.value as string
        )
        onChange(formattedValue)
      }}
      options={enumOptions}
      placeholder={placeholder}
      value={value}
    />
  </Fragment>
)

MultiSelect.defaultProps = {
  disabled: false,
  placeholder: '',
  value: [],
}

export default MultiSelect
