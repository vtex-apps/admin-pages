import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  hasLeftPadding?: boolean
  isChild?: boolean
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void
  title: string
  treePath: string
}

const ListItem = ({
  hasLeftPadding,
  isChild,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}: Props) => (
  <div
    className={`w-100 pv5 dark-gray bg-inherit tl ${
      hasLeftPadding ? 'pl7 pr0' : 'ph0'
    }`}
    data-tree-path={treePath}
    key={treePath}
    onClick={onEdit}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ animationDuration: '0.2s' }}
  >
    <FormattedMessage id={title}>
      {text => (
        <span className={`f6 fw5 track-1 ${isChild ? 'pl7' : 'pl2'}`}>
          {text}
        </span>
      )}
    </FormattedMessage>
  </div>
)

export default ListItem
