import React from 'react'
import { injectIntl } from 'react-intl'
import { Button, Modal as StyleguideModal } from 'vtex.styleguide'

import SaveButton from './SaveButton'

type Props = {
  isOpen: boolean
  isSaveLoading: boolean
  onClickDiscard: (event: Event) => void
  onClickSave: (event: Event) => void
  onClose: (event: Event) => void
}

const Modal = ({
  intl,
  isOpen,
  isSaveLoading,
  onClickDiscard,
  onClickSave,
  onClose,
}: Props & ReactIntl.InjectedIntlProps) => (
  <StyleguideModal centered isOpen={isOpen} onClose={onClose}>
    <div>
      {intl.formatMessage({
        id: 'pages.editor.components.modal.text',
      })}
    </div>
    <div className="mt6 flex justify-end">
      <div className="mr3">
        <Button onClick={onClickDiscard} size="small" variation="tertiary">
          {intl.formatMessage({
            id: 'pages.editor.components.modal.button.discard',
          })}
        </Button>
      </div>
      <SaveButton
        isLoading={isSaveLoading}
        onClick={onClickSave}
        variation="primary"
      >
        {intl.formatMessage({
          id: 'pages.editor.components.button.save',
        })}
      </SaveButton>
    </div>
  </StyleguideModal>
)

export default injectIntl(Modal)
