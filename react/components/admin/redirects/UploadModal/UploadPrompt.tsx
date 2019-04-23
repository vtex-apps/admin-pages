import React, { useState } from 'react'
import ReactDropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import { Radio } from 'vtex.styleguide'

import PaperIcon from '../../../icons/PaperIcon'
import { UploadActionType } from '../mutations/SaveRedirectFromFile'

interface Props {
  hasRedirects: boolean
  saveRedirectFromFile: (
    acceptedFiles: File[],
    uploadActionType: UploadActionType
  ) => void
}

const UploadPrompt: React.FC<Props> = ({
  hasRedirects,
  saveRedirectFromFile,
}) => {
  const [uploadActionType, setUploadActionType] = useState<UploadActionType>(
    'merge'
  )

  return (
    <>
      <h1 className="self-start fw3 mv0">
        <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.title" />
      </h1>
      <p className="f6 lh-copy">
        <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.body.first" />
        <a
          className="c-action-primary link hover-c-action-primary pointer"
          download
          href="/_v/private/pages/redirects_template.csv"
        >
          <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.body.sample-download" />
        </a>
        {hasRedirects && (
          <>
            <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.or" />
            <a
              download
              className="c-action-primary link hover-c-action-primary pointer"
              href="/_v/private/pages/redirects.csv"
            >
              <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.current-configurations" />
            </a>
          </>
        )}
        .
        <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.body.second" />
      </p>

      {hasRedirects && (
        <div className="self-start mb4">
          <p className="mt2">
            <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.upload-behavior.title" />
            :
          </p>
          <div>
            <Radio
              id="merge-upload-action-type"
              checked={uploadActionType === 'merge'}
              label={
                <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.upload-behavior.merge" />
              }
              name="upload-action-type"
              onChange={() => setUploadActionType('merge')}
              value="merge"
            />
            <Radio
              id="overwrite-upload-action-type"
              checked={uploadActionType === 'overwrite'}
              label={
                <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.upload-behavior.overwrite" />
              }
              name="upload-action-type"
              onChange={() => setUploadActionType('overwrite')}
              value="overwrite"
            />
          </div>
        </div>
      )}

      <div className="w-100 pv8 ba br3 bw1 b--action-primary b--dashed flex items-center justify-center">
        <ReactDropzone
          onDrop={acceptedFiles =>
            saveRedirectFromFile(acceptedFiles, uploadActionType)
          }
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({
                className: 'flex flex-column items-center justify-center',
              })}
            >
              <input {...getInputProps()} />
              <div className="c-action-primary">
                <PaperIcon />
              </div>
              <p className="tc lh-copy mb0">
                <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.drop.message" />
                <button className="input-reset bg-white bw0 fw5 pa0 hover-c-action-primary c-action-primary pointer">
                  <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.drop.button" />
                </button>
                .
              </p>
            </div>
          )}
        </ReactDropzone>
      </div>
    </>
  )
}

export default React.memo(UploadPrompt)
