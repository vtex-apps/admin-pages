import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Radio } from 'vtex.styleguide'

import { UploadActionType } from '../mutations/SaveRedirectFromFile'
import { ModalStates } from './typings'

interface Props {
  uploadActionType: UploadActionType | null
  setModalStep: React.Dispatch<React.SetStateAction<ModalStates>>
  setUploadActionType: React.Dispatch<
    React.SetStateAction<UploadActionType | null>
  >
}

export default function SelectAction({
  uploadActionType,
  setModalStep,
  setUploadActionType,
}: Props) {
  return (
    <>
      <p className="f4 fw3 mt0 mb5">
        <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.select-action.body" />
      </p>
      <Radio
        id="merge-upload-action-type"
        checked={uploadActionType === 'save'}
        label={
          <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.select-action.save" />
        }
        name="upload-action-type"
        onChange={() => {
          setUploadActionType('save')
          setModalStep('UPLOAD_FILE')
        }}
        value="save"
      />
      <Radio
        id="overwrite-upload-action-type"
        checked={uploadActionType === 'delete'}
        label={
          <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.select-action.delete" />
        }
        name="upload-action-type"
        onChange={() => {
          setUploadActionType('delete')
          setModalStep('UPLOAD_FILE')
        }}
        value="delete"
      />
    </>
  )
}
