import classnames from 'classnames'
import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

interface Props extends InjectedIntlProps {
  hasSubitems?: boolean
  isEditable: boolean
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
  hasSubitems,
  intl,
  isEditable,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}) => {
  const handleKeyDown = useKeydownFromClick(onEdit)

  const leftPaddingClassName = hasSubitems ? 'pl2' : 'pl8'

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
        ...(!hasSubitems ? { marginLeft: 1 } : null),
        ...{ cursor: isEditable ? 'pointer' : 'default' },
      }}
      tabIndex={0}
    >
      <span className="f6 fw4 track-1 pl2">
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
