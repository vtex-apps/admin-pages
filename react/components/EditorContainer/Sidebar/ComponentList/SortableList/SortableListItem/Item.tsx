import classnames from 'classnames'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

interface Props {
  hasSubItems?: boolean
  isEditable: boolean
  isSortable?: boolean
  isChild?: boolean
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void
  title: string
  treePath: string
}

const messages = defineMessages({
  untitledBlock: {
    defaultMessage: 'Untitled Block',
    id: 'admin/pages.editor.component-list.untitled',
  },
})

const Item: React.FunctionComponent<Props> = ({
  hasSubItems,
  isEditable,
  isSortable,
  isChild,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}) => {
  const intl = useIntl()
  let leftPaddingClassName = 'pl8'
  if ((isSortable && !hasSubItems) || isChild) {
    leftPaddingClassName = 'pl5'
  } else if (isSortable || hasSubItems) {
    leftPaddingClassName = 'pl2'
  }

  return (
    <div
      className={classnames(
        'w-100 pv5 pr0 dark-gray bg-inherit tl',
        leftPaddingClassName,
        {
          'hover-bg-light-silver': isEditable,
        }
      )}
      data-tree-path={treePath}
      key={treePath}
      onClick={onEdit}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...{ animationDuration: '0.2s' },
        ...(!hasSubItems || isSortable ? { marginLeft: 1 } : null),
        ...{ cursor: isEditable ? 'pointer' : 'default' },
      }}
    >
      <span className={`f6 fw4 track-1 ${isChild ? 'pl7' : 'pl2'}`}>
        {typeof title === 'string' ? (
          formatIOMessage({ id: title, intl })
        ) : (
          <i>{intl.formatMessage(messages.untitledBlock)}</i>
        )}
      </span>
    </div>
  )
}

export default Item
