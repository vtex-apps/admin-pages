import React from 'react'

import styles from './styles.css'

interface Props {
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  value?: string
}

const EditableText: React.FC<Props> = ({ onChange, placeholder, value }) => (
  <input
    className={`bn font-body input-reset f4 pa3 ${styles.input}`}
    onChange={onChange}
    placeholder={placeholder}
    type="text"
    value={value}
  />
)

export default EditableText
