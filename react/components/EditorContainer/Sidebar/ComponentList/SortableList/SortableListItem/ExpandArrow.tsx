import React from 'react'

import ArrowIcon from '../../../../../icons/ArrowIcon'

import SideItem from './SideItem'

interface Props {
  hasRightMargin?: boolean
  isExpanded: boolean
  onClick: () => void
}

const ExpandArrow: React.SFC<Props> = ({
  hasRightMargin,
  isExpanded,
  onClick,
}) => (
  <SideItem isPointer onClick={onClick}>
    <div
      className={`flex items-center ${isExpanded ? '' : 'rotate-90'}`}
      style={hasRightMargin ? { marginRight: '44px' } : undefined}
    >
      <ArrowIcon />
    </div>
  </SideItem>
)

export default ExpandArrow
