import classnames from 'classnames'
import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

interface Props extends InjectedIntlProps {
  hasSubItems?: boolean
  isEditable: boolean
  isSortable?: boolean
  isChild?: boolean
  onEdit: () => void
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
  intl,
  isEditable,
  isSortable,
  isChild,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}) => {
  const handleKeyDown = useKeydownFromClick(onEdit)

  let leftPaddingClassName = 'pl8'
  if ((isSortable && !hasSubItems) || isChild) {
    leftPaddingClassName = 'pl5'
  } else if (isSortable || hasSubItems) {
    leftPaddingClassName = 'pl2'
  }

  return (
    <div
      className={classnames(
        'w-100 pv5 pr0 dark-gray bg-inherit tl outline-0',
        leftPaddingClassName,
        {
          'hover-bg-light-silver': isEditable,
        }
      )}
      data-tree-path={treePath}
      key={treePath}
      onClick={onEdit}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="treeitem"
      style={{
        ...{ animationDuration: '0.2s' },
        ...(!hasSubItems || isSortable ? { marginLeft: 1 } : null),
        ...{ cursor: isEditable ? 'pointer' : 'default' },
      }}
      tabIndex={0}
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

export default injectIntl(Item)
