import React from 'react'
import { FormattedMessage } from 'react-intl'
import IconImage from '../../MediaGalleryWidget/icons/IconImage'

const EmptyState = () => {
  return (
    <div
      style={{ padding: '1.875rem 2.75rem' }}
      className="h-100 flex flex-column justify-center items-center pointer b--mid-gray b--dashed ba br2"
    >
      <div className="mb4 c-muted-1">
        <IconImage />
      </div>
      <div style={{ maxWidth: '9.3rem' }} className="mb4 tc gray c-muted-1">
        <FormattedMessage id="admin/pages.editor.image-uploader.empty.button" />
      </div>
    </div>
  )
}

export default React.memo(EmptyState)
