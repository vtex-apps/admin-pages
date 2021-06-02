import React from 'react'
import { FormattedMessage } from 'react-intl'
import IconImage from '../../MediaGalleryWidget/icons/IconImage'
import styles from './styles.css'

const EmptyState = () => {
  return (
    <div
      className={`h-100 flex flex-column justify-center items-center pointer b--mid-gray b--dashed ba br2 ${styles.emptyStateWrapper}`}
    >
      <div className="mb4 c-muted-1">
        <IconImage />
      </div>
      <div className={`mb4 tc gray c-muted-1 ${styles.imageUploaderText}`}>
        <FormattedMessage id="admin/pages.editor.image-uploader.empty.button" />
      </div>
    </div>
  )
}

export default React.memo(EmptyState)
