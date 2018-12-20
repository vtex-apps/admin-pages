import React from 'react'

import ArrowIcon from '../../../icons/ArrowIcon'

import SideItem from './SideItem'

interface Props {
  isExpanded: boolean
  onClick: () => void
}

const ExpandArrow: React.SFC<Props> = ({ isExpanded, onClick }) => (
  <SideItem isPointer onClick={onClick}>
    <div className={`flex items-center ${isExpanded ? '' : 'rotate-90'}`}>
      <ArrowIcon />
    </div>
  </SideItem>
)
export default ExpandArrow
