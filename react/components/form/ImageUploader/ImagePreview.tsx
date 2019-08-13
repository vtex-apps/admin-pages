import React, { useMemo } from 'react'
import { IconEdit } from 'vtex.styleguide'

import styles from './ImagePreview.css'

interface Props {
  imageUrl: string
}

const ImagePreview: React.FC<Props> = ({ imageUrl }) => {
  const backgroundImageStyle = useMemo(
    () => ({
      backgroundImage: `url("${imageUrl}")`,
    }),
    [imageUrl]
  )

  return (
    <div
      className="w-100 h-100 relative bg-center contain"
      style={backgroundImageStyle}
    >
      <div
        className={`w-100 h-100 absolute bottom-0 br2 flex flex-column items-center justify-center ${styles.overlay}`}
      >
        <div className="absolute bg-action-primary br2 flex h2 items-center justify-center mr3 mt3 right-0 top-0 w2 white">
          <IconEdit size={14} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(ImagePreview)
