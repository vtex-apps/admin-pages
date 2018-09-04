import React from 'react'
import { Button, Modal as StyleguideModal } from 'vtex.styleguide'

interface Props {
  isActionDanger?: boolean
  isActionLoading: boolean
  isOpen: boolean
  onClickAction: (event: Event) => void
  onClickCancel: (event: Event) => void
  onClose: (event: Event) => void
  textButtonAction: string
  textButtonCancel: string
  textMessage: string
}

const Modal = ({
  isActionDanger = false,
  isActionLoading,
  isOpen,
  onClickAction,
  onClickCancel,
  onClose,
  textButtonAction,
  textButtonCancel,
  textMessage,
}: Props) => (
  <StyleguideModal centered isOpen={isOpen} onClose={onClose}>
    <div>{textMessage}</div>
    <div className="mt6 flex justify-end">
      <div className="mr3">
        <Button onClick={onClickCancel} size="small" variation="tertiary">
          {textButtonCancel}
        </Button>
      </div>
      <Button
        isLoading={isActionLoading}
        onClick={onClickAction}
        size="small"
        variation={isActionDanger ? 'danger' : 'primary'}
      >
        {textButtonAction}
      </Button>
    </div>
  </StyleguideModal>
)

export default Modal
