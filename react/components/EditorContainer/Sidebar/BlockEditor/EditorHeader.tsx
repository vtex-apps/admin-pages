import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { IconArrowBack, IconClose, Tooltip } from 'vtex.styleguide'

import ContentLibraryIcon from '../../../icons/ContentLibraryIcon'

interface CustomProps {
  isTitleEditable?: boolean
  onBack?: () => void
  onListClose?: () => void
  onListOpen?: () => void
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
}

type Props = CustomProps & InjectedIntlProps

const noOp = () => {
  return
}

const EditorHeader: React.FC<Props> = ({
  intl,
  onBack,
  onListClose,
  onListOpen,
  title,
}) => {
  const handleBackKeyDown = useKeydownFromClick(onBack || noOp)
  const handleCloseListKeyDown = useKeydownFromClick(onListClose || noOp)
  const handleOpenListKeyDown = useKeydownFromClick(onListOpen || noOp)

  const titleBaseClassName = 'w-100 ma0 lh-copy f5 fw5 near-black'

  return (
    <div className="w-100 ph5 pt4 pb2">
      <div className="w-100 flex justify-between">
        <div className="w-100 flex items-center">
          {onBack && (
            <span
              className="pointer outline-0 c-on-base hover-c-action-primary"
              onClick={onBack}
              onKeyDown={handleBackKeyDown}
              role="button"
              tabIndex={0}
            >
              <IconArrowBack />
            </span>
          )}

          <div className="w-100 pl3 flex flex-grow-1 justify-between items-center">
            <h4 className={`ba b--transparent ${titleBaseClassName}`}>
              {title}
            </h4>
          </div>

          {onListClose && (
            <span
              className="pointer outline-0 c-on-base hover-c-action-primary"
              onClick={onListClose}
              onKeyDown={handleCloseListKeyDown}
              role="button"
              tabIndex={0}
            >
              <IconClose />
            </span>
          )}

          {onListOpen && (
            <Tooltip
              label={intl.formatMessage({
                defaultMessage: 'Content cards',
                id: 'admin/pages.editor.component-list.title',
              })}
              position="left"
            >
              <span
                className="pointer outline-0 c-on-base hover-c-action-primary"
                onClick={onListOpen}
                onKeyDown={handleOpenListKeyDown}
                role="button"
                tabIndex={0}
              >
                <ContentLibraryIcon />
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default injectIntl(EditorHeader)
