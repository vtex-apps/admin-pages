import React from 'react'
import { calcIconSize } from './utils'

interface Props {
  className?: string
  size?: number
}

const iconBase = {
  height: 12,
  width: 6,
}

const DragHandle: React.FunctionComponent<Props> = ({
  size,
  className,
  ...props
}) => {
  const newSize = calcIconSize(iconBase, size as number) // TS doesn't detect defaultProps

  return (
    <svg
      className={`editor-icon editor-icon--fill ${className}`}
      width={newSize.width}
      height={newSize.height}
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="1" cy="1" r="1" transform="translate(4)" />
      <circle cx="1" cy="1" r="1" transform="translate(4 5)" />
      <circle cx="1" cy="1" r="1" transform="translate(4 10)" />
      <circle cx="1" cy="1" r="1" />
      <circle cx="1" cy="1" r="1" transform="translate(0 5)" />
      <circle cx="1" cy="1" r="1" transform="translate(0 10)" />
    </svg>
  )
}

DragHandle.defaultProps = {
  size: 20,
}

export default React.memo(DragHandle)
