import classnames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  hasSubItems?: boolean
  isSortable?: boolean
  isChild?: boolean
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void
  title: string
  treePath: string
}

const Item: React.SFC<Props> = ({
  hasSubItems,
  isSortable,
  isChild,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}) => {
  let leftPaddingClassName = 'pl8'
  if (isChild) {
    leftPaddingClassName = 'pl6'
  } else if (isSortable && !hasSubItems) {
    leftPaddingClassName = 'pl5'
  } else if (isSortable) {
    leftPaddingClassName = 'pl2'
  } else if (hasSubItems) {
    leftPaddingClassName = 'pl3'
  }

  return (
    <div
      className={classnames(
        'w-100 pv5 pr0 dark-gray bg-inherit tl',
        leftPaddingClassName
      )}
      data-tree-path={treePath}
      key={treePath}
      onClick={onEdit}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...{ animationDuration: '0.2s' },
        ...(!hasSubItems || isSortable ? { marginLeft: 1 } : null),
      }}
    >
      <FormattedMessage id={title}>
        {text => (
          <span className={`f6 fw4 track-1 ${isChild ? 'pl7' : 'pl2'}`}>
            {text}
          </span>
        )}
      </FormattedMessage>
    </div>
  )
}

export default Item
