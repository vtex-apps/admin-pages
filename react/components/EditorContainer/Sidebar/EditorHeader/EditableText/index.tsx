import React from 'react'

import styles from './styles.css'

interface Props {
  baseClassName: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  value?: string
}

const EditableText: React.FC<Props> = ({
  baseClassName,
  onChange,
  placeholder,
  value,
}) => (
  <input
    className={`bn font-body input-reset ${baseClassName} ${styles.input}`}
    onChange={onChange}
    placeholder={placeholder}
    type="text"
    value={value}
  />
)

export default EditableText
