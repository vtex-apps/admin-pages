import classnames from 'classnames'
import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'

interface Props {
  horizontalPaddingClassName?: string
  isPointer?: boolean
  onClick?: () => void
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const noOp = () => {}

const SideItem: React.FunctionComponent<Props> = ({
  children,
  horizontalPaddingClassName,
  isPointer,
  onClick,
  onMouseEnter,
}) => {
  const handleKeyDown = useKeydownFromClick(onClick || noOp)

  return (
    <div
      className={classnames(
        `flex items-center pv5 bg-inherit c-muted-3 hover-bg-light-silver hover-black-90`,
        { pointer: isPointer },
        horizontalPaddingClassName
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  )
}

SideItem.defaultProps = {
  horizontalPaddingClassName: 'ph3',
}

export default SideItem
