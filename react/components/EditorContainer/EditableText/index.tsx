import React from 'react'
import { IconEdit } from 'vtex.styleguide'

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
}) => {
  const [isEditing, setIsEditing] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const startEditing = React.useCallback(() => {
    inputRef && inputRef.current && inputRef.current.focus()
  }, [inputRef])

  const handleOnFocus = React.useCallback(() => {
    setIsEditing(true)
  }, [setIsEditing])

  const handleOnBlur = React.useCallback(
    e => {
      setIsEditing(false)
      onBlur && onBlur(e)
    },
    [setIsEditing, onBlur]
  )

  return (
    <div
      role="presentation"
      className={`flex items-baseline bb b--light-gray ${
        isEditing ? 'hover-b--action-primary' : ''
      } pb2 ${isEditing ? 'b--action-primary' : ''} ${
        styles.editableTextInputWrapper
      }`}
      style={{ cursor: 'text' }}
      onClick={startEditing}
    >
      <input
        className={`flex-grow-1 w-100 truncate outline-0 c-on-base bn font-body input-reset ${baseClassName} ${styles.input}`}
        onChange={onChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        disabled={disabled}
        onKeyPress={onKeyPress}
        placeholder={placeholder || ''}
        ref={inputRef}
        type="text"
        value={value || ''}
      />
      <span
        className={`${styles.editableTextInputWrapper__input} ${
          isEditing ? 'dn' : ''
        }`}
      >
        <IconEdit />
      </span>
    </div>
  )
}

export default EditableText
