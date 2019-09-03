import React from 'react'

import styles from './ArrayFieldTemplateItem.css'

const PreviewOverlay = () => (
  <div
    className={`br3 absolute w-100 h-100 top-0 ${styles['preview-overlay']}`}
  ></div>
)

export default React.memo(PreviewOverlay)
