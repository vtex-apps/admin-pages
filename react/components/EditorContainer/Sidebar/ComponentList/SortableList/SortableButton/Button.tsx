import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  hasLeftPadding?: boolean
  isChild?: boolean
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: (event: React.MouseEvent<HTMLButtonElement>) => void
  title: string
  treePath: string
}

const Button = ({
  hasLeftPadding,
  isChild,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}: Props) => (
  <button
    className={`w-100 pv5 bg-white hover-blue dark-gray pointer tl bn ${
      hasLeftPadding ? 'pl7 pr0' : 'ph0'
    }`}
    data-tree-path={treePath}
    key={treePath}
    onClick={onEdit}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ animationDuration: '0.2s' }}
    type="button"
  >
    <FormattedMessage id={title}>
      {text => (
        <span className={`f6 fw5 track-1  ${isChild ? 'pl7' : 'pl2'}`}>
          {text}
        </span>
      )}
    </FormattedMessage>
  </button>
)

export default Button
