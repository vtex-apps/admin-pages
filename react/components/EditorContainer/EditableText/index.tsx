import React from 'react'

import styles from './styles.css'

interface Props {
  baseClassName: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>
  disabled?: boolean
  placeholder?: string
  value?: string
}

const EditableText: React.FC<Props> = ({
  baseClassName,
  onChange,
  onBlur,
  onKeyPress,
  disabled,
  placeholder,
  value,
}) => (
  <input
    className={`truncate outline-0 c-on-base bb bt-0 br-0 bl-0 b--light-gray hover-b--action-primary pb2 font-body input-reset ${baseClassName} ${styles.input}`}
    onChange={onChange}
    onBlur={onBlur}
    disabled={disabled}
    onKeyPress={onKeyPress}
    placeholder={placeholder || ''}
    type="text"
    value={value || ''}
  />
)

export default EditableText
