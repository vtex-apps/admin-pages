import React from 'react'
import { FormattedMessage } from 'react-intl'

import IconImage from '../../MediaGalleryWidget/icons/IconImage'
import styles from './styles.css'

const EmptyState = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div
      className={`flex justify-center align-center items-center ${styles.emptyStateContainer}`}
    >
      <div
        style={style}
        className={`h-100 flex flex-column justify-center items-center pointer b--mid-gray b--dashed ba br2 c-muted-1 ${styles.emptyState}`}
      >
        <div className="mb4">
          <IconImage />
        </div>
        <div className={`tc ${styles.imageUploaderText}`}>
          <FormattedMessage id="admin/pages.editor.image-uploader.empty.button" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(EmptyState)
