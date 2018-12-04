import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: (event: React.MouseEvent<HTMLButtonElement>) => void
  title: string
  treePath: string
}

const Button = ({
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}: Props) => (
  <button
    className="w-100 pv5 ph0 bg-white hover-blue dark-gray pointer tl bn"
    data-tree-path={treePath}
    key={treePath}
    onClick={onEdit}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ animationDuration: '0.2s' }}
    type="button"
  >
    <FormattedMessage id={title}>
      {text => <span className="pl5 f6 fw5 track-1">{text}</span>}
    </FormattedMessage>
  </button>
)

export default Button
