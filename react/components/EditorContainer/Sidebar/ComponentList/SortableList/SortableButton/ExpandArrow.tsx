import React from 'react'

import SideButton from './SideButton'

interface Props {
  isExpanded: boolean
  onClick: () => void
}

const ExpandArrow: React.SFC<Props> = ({ isExpanded, onClick }) => (
  <SideButton onClick={onClick}>{isExpanded ? 'V' : '>'}</SideButton>
)

export default ExpandArrow
