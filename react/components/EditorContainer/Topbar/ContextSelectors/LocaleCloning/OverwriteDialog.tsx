import React, { FunctionComponent, useState } from 'react'
// TODO: IconWarning is not exported from vtex.styleguide?
// Need to investigate. Meanwhile, ts-ignore
// @ts-ignore
import { Button, IconWarning, Modal } from 'vtex.styleguide'
import { BindingSelectorState } from './BindingSelector'

interface Props {
  currentLocaleLabel: string
  isOpen?: boolean
  state: BindingSelectorState
  pathId: string
  // TODO: better types
  onClose: () => void
  onConfirm?: (...args: any) => any
  onCancel?: (...args: any) => any
}

export const useOverwriteDialogState = () => {
  const [overwriteHandlers, setOverwriteHandlers] = useState<null | {
    onConfirm: (...args: any) => any
    onCancel: (...args: any) => any
  }>(null)

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

const OverwriteDialog: FunctionComponent<Props> = ({
  currentLocaleLabel,
  isOpen,
  onClose,
  state,
  pathId,
  onConfirm,
  onCancel,
}) => {
  const overwrittenContent =
    state?.filter(
      item => item.overwritesPage && item.checked && !item.overwritesTemplate
    ) ?? []

  const overwrittenTemplates =
    state?.filter(item => item.overwritesTemplate && item.checked) ?? []

  // TODO: i18n text
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
              Go back
            </Button>
          </span>
          <Button
            variation="primary"
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="mb6">
        <h3 className="t-heading-3 near-black fw6 mb8 mt0">
          Overwrite content
        </h3>

        <p className="f5 mid-gray mb8">
          By duplicating the binding content, you will also overwrite the
          templates and/or contents of all the selected locations for{' '}
          <strong>{currentLocaleLabel}</strong> template. Are you sure you want
          to continue?
        </p>

        {overwrittenTemplates.length >= 1 && (
          <>
            <h5 className="t-heading-5 near-black fw6 mt0 mb3">
              Bindings with different templates
            </h5>

            <p className="f5 mid-gray mb2 mt0">
              The templates of these bindings will be overriden for{' '}
              <strong>English (en-GB)</strong> template.
            </p>

            {overwrittenTemplates.map(item => (
              <>
                <div className="near-black mt6">
                  <span className="mr3">
                    <IconWarning />
                  </span>
                  Binding: {item.label}
                  <span className="c-muted-2">{pathId}</span>
                </div>

                {item.supportedLocales && (
                  <ul className="list pa0 ma0 mt3 ml6 f6 c-muted-1">
                    <li className="dib">
                      Locales:{' '}
                      {item.supportedLocales
                        .map(locale => locale.label)
                        .join(', ')}
                    </li>
                  </ul>
                )}
              </>
            ))}
          </>
        )}

        {overwrittenContent.length >= 1 && (
          <>
            <h5 className="t-heading-5 near-black fw6 mt0 mb3">
              Bindings with the same template
            </h5>

            <p className="f5 mid-gray mb2 mt0">
              The content of these locales will be overriden for{' '}
              <strong>{currentLocaleLabel}</strong>
              content.
            </p>

            {overwrittenContent.map(item => (
              <>
                <div className="near-black mt6">
                  <span className="mr3">
                    <IconWarning />
                  </span>
                  Binding: {item.label}
                  <span className="c-muted-2">{pathId}</span>
                </div>

                {item.supportedLocales && (
                  <ul className="list pa0 ma0 mt3 ml6 f6 c-muted-1">
                    <li className="dib">
                      Locales:{' '}
                      {item.supportedLocales
                        .map(locale => locale.label)
                        .join(', ')}
                    </li>
                  </ul>
                )}
              </>
            ))}
          </>
        )}
      </div>
    </Modal>
  )
}

export default OverwriteDialog
