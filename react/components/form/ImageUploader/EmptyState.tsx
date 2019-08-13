import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconUpload } from 'vtex.styleguide'

const EmptyState = () => {
  return (
    <div className="h-100 flex flex-column justify-center items-center pointer">
      <div className="mb3 c-action-primary">
        <IconUpload />
      </div>
      <div className="mb4 tc gray c-action-primary b underline">
        <FormattedMessage
          id="admin/pages.editor.image-uploader.empty.button"
          defaultMessage="Upload"
        />
      </div>
      <p className="mv0 c-muted-2 f7">
        <FormattedMessage
          id="admin/pages.editor.image-uploader.empty.subtext-1"
          defaultMessage="or"
        />{' '}
        <span className="b">
          <FormattedMessage
            id="admin/pages.editor.image-uploader.empty.subtext-2"
            defaultMessage="drag and drop"
          />
        </span>{' '}
        <FormattedMessage
          id="admin/pages.editor.image-uploader.empty.subtext-3"
          defaultMessage="an image"
        />
      </p>
    </div>
  )
}

export default React.memo(EmptyState)
