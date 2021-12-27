import React, { FunctionComponent, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal } from 'vtex.styleguide'

import { BindingSelectorState } from './BindingSelector'

interface Props {
  isOpen?: boolean
  state: BindingSelectorState
  pathId: string
  onClose: () => void
  onConfirm?: (value: void | PromiseLike<void>) => void
  onCancel?: (reason?: unknown) => void
}

export const useOverwriteDialogState = () => {
  const [overwriteHandlers, setOverwriteHandlers] = useState<null | {
    onConfirm: (value: void | PromiseLike<void>) => void
    onCancel: (reason?: unknown) => void
  }>(null)

  return {
    isOverwriteDialogOpen: Boolean(overwriteHandlers),
    showOverwriteDialog: setOverwriteHandlers,
    hideOverwriteDialog: () => {
      setOverwriteHandlers(null)
    },
    onOverwriteConfirm: overwriteHandlers?.onConfirm ?? (() => undefined),
    onOverwriteCancel: overwriteHandlers?.onCancel ?? (() => undefined),
  }
}

const OverwriteDialog: FunctionComponent<Props> = ({
  isOpen,
  onClose,
  state,
  pathId,
  onConfirm,
  onCancel,
}) => {
  const overwrittenContent =
    state?.filter(item => item.overwrites && item.checked) ?? []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      bottomBar={
        <div className="flex justify-end">
          <span className="mr4">
            <Button
              variation="secondary"
              onClick={() => {
                onCancel?.()
                onClose()
              }}
            >
              <FormattedMessage id="admin/pages.editor.components.button.go-back" />
            </Button>
          </span>
          <Button
            variation="danger"
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
          >
            <FormattedMessage id="admin/pages.editor.components.button.overwrite" />
          </Button>
        </div>
      }
    >
      <div className="mb6">
        <div className="mb6">
          <h2 className="mb4">
            <FormattedMessage id="admin/pages.editor.copy-page.overwritedialog.header" />
          </h2>
          {overwrittenContent.length > 1 ? (
            <FormattedMessage id="admin/pages.editor.copy-page.overwritedialog.subheader.singular" />
          ) : (
            <FormattedMessage id="admin/pages.editor.copy-page.overwritedialog.subheader.plural" />
          )}
        </div>
        <div className="mb6 ml6">
          <ul>
            {overwrittenContent.map(item => (
              <li className="mb4" key={item.id}>
                <div>
                  {item.label}
                  <span className="c-muted-2">{pathId}</span>
                </div>
                {item.supportedLocales && item.supportedLocales.length > 0 && (
                  <ul className="list pa0 ma0 mt2 ml6 f6 c-muted-1">
                    {item.supportedLocales.map((locale, i, arr) => (
                      <li className="dib" key={locale}>
                        {locale}
                        {i < arr.length - 1 && <span>, </span>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <FormattedMessage id="admin/pages.editor.copy-page.overwritedialog.confirmation" />
      </div>
    </Modal>
  )
}

export default OverwriteDialog
