import { createKeydownFromClick } from 'keydown-from-click'
import React, { useMemo } from 'react'

import styles from './ImagePreview.css'

interface Props {
  imageUrl: string
  children: React.ReactElement
}

function stopPropagation(
  e: Pick<React.MouseEvent<HTMLDivElement>, 'stopPropagation'>
) {
  e.stopPropagation()
}

const stopOnKeyDownPropagation = createKeydownFromClick(stopPropagation)

const ImagePreview: React.FC<Props> = ({ children, imageUrl }) => {
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
        <div
          className="absolute bg-action-primary br2 flex h2 items-center justify-center mr3 mt3 right-0 top-0 w2 white"
          onClick={stopPropagation}
          onKeyDown={stopOnKeyDownPropagation}
          role="button"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ImagePreview)
