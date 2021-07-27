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
      backgroundImage: `url(${imageUrl}?width=710&height=384&aspect=true)`,
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
          style={{ top: '0.5rem', right: '0.5rem' }}
          className="absolute bg-action-primary br2 flex h2 items-center justify-center w2 white"
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
