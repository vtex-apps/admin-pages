import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { IconArrowBack, IconClose } from 'vtex.styleguide'

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

  return (
    <div className="ph5 pt4 pb2">
      <div className="w-100 flex justify-between">
        <div
          className="flex items-center c-action-primary hover-c-action-primary pointer"
          role="button"
          tabIndex={0}
          onKeyDown={handleBackKeyDown}
          onClick={onBack}
        >
          {onBack && (
            <React.Fragment>
              <span className="outline-0">
                <IconArrowBack />
              </span>
              <span className="ml3 fw5 f7 ttu">
                {intl.formatMessage({
                  defaultMessage: 'Back',
                  id: 'admin/pages.editor.component-list.back',
                })}
              </span>
            </React.Fragment>
          )}
        </div>
        <div>
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
            <span
              className="pointer outline-0 c-action-primary hover-c-action-primary ttu f7 fw5"
              role="button"
              tabIndex={0}
              onClick={onListOpen}
              onKeyDown={handleOpenListKeyDown}
            >
              {intl.formatMessage({
                defaultMessage: 'Configurations',
                id: 'admin/pages.editor.component-list.title',
              })}
            </span>
          )}
        </div>
      </div>

      <div className="w-100 flex flex-grow-1 justify-between items-center mb6">
        <h4 className="w-100 ma0 lh-copy f4 fw4 near-black ba b--transparent">
          {title}
        </h4>
      </div>
    </div>
  )
}

export default injectIntl(EditorHeader)
