import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

import ComponentDragHandleIcon from '../../../icons/ComponentDragHandleIcon'

import SideItem from './SideItem'

interface Props {
  onMouseEnter: () => void
}

const DragHandle = SortableHandle<Props>(({ onMouseEnter }) => (
  <SideItem isPointer onMouseEnter={onMouseEnter}>
    <ComponentDragHandleIcon />
  </SideItem>
))

export default DragHandle
