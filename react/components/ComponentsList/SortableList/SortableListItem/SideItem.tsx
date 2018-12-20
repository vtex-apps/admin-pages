import React from 'react'

interface Props {
  isPointer?: boolean
  onClick?: () => void
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const SideItem: React.SFC<Props> = ({
  children,
  isPointer,
  onClick,
  onMouseEnter,
}) => (
  <div
    className={`flex items-center ph3 pv5 bg-inherit dark-gray ${
      isPointer ? 'pointer' : ''
    }`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
  >
    {children}
  </div>
)

export default SideItem
