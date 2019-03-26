import classnames from 'classnames'
import React from 'react'

interface Props {
  horizontalPaddingClassName?: string
  isPointer?: boolean
  onClick?: () => void
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const SideItem: React.FunctionComponent<Props> = ({
  children,
  horizontalPaddingClassName,
  isPointer,
  onClick,
  onMouseEnter,
}) => (
  <div
    className={classnames(
      `flex items-center pv5 bg-inherit c-muted-3 hover-black-90`,
      { pointer: isPointer },
      horizontalPaddingClassName
    )}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
  >
    {children}
  </div>
)

SideItem.defaultProps = {
  horizontalPaddingClassName: 'ph3',
}

export default SideItem
