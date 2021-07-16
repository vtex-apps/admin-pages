import React, { FunctionComponent, useState } from 'react'
import { Button, Modal } from 'vtex.styleguide'
import { BindingSelectorState } from './BindingSelector'

interface Props {
  isOpen?: boolean
  state: BindingSelectorState
  pathId: string
  // TODO: better types
  onClose: () => void,
  onConfirm?: (...args: any) => any
  onCancel?: (...args: any) => any
}

export const useOverwriteDialogState = () => {
  const [overwriteHandlers, setOverwriteHandlers] = useState<null | { onConfirm: (...args: any) => any, onCancel: (...args: any) => any }>(null)

  return {
    isOverwriteDialogOpen: Boolean(overwriteHandlers),
    showOverwriteDialog: setOverwriteHandlers,
    hideOverwriteDialog: () => {
      setOverwriteHandlers(null)
    },
    onOverwriteConfirm: overwriteHandlers?.onConfirm ?? (() => {}),
    onOverwriteCancel: overwriteHandlers?.onCancel ?? (() => {}),
  }
}

const OverwriteDialog: FunctionComponent<Props> = ({ isOpen, onClose, state, pathId, onConfirm, onCancel }) => {
  const overwrittenContent = state?.filter(item => item.overwrites && item.checked) ?? []

  // TODO: i18n text
  return (
    <Modal isOpen={isOpen} onClose={onClose} bottomBar={
      <div className="flex justify-end">
        <span className="mr4">
          <Button
            variation="secondary"
            onClick={() => {
              onCancel?.()
              onClose()
            }}>
            Go back
          </Button>
        </span>
        <Button
          variation="danger"
          onClick={() => {
            onConfirm?.()
            onClose()
          }}
        >
          Overwrite
        </Button>
      </div>
    }>
      <div className="mb6">
        <h2>Existing content will be overwritten</h2>
        {overwrittenContent.length > 1
          ? (
            <div>
              Existing content in these bindings will be permanently deleted:
            </div>
          )
          : (
            <div>
              Existing content in this binding will be permanently deleted:
            </div>
          )}

        <ul>
          {overwrittenContent.map((item) => (
            <li className="mb4">
              <div>
                {item.label}<span className="c-muted-2">{pathId}</span>
              </div>

            {item.supportedLocales && item.supportedLocales.length > 1 && (
              <ul className="list pa0 ma0 mt2 ml6 f6 c-muted-1">
                {item.supportedLocales.map((locale, i, arr) => (
                  <li className="dib">{locale}{(i<arr.length-1) && <span>,{' '}</span>}</li>
                ))}
              </ul>
            )}
            </li>
          ))}
        </ul>
        <div>
          Are you sure you want to duplicate the content to them?
        </div>
      </div>
    </Modal>
  )
}

export default OverwriteDialog
