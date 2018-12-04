import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

import ComponentDragHandleIcon from '../../../../../icons/ComponentDragHandleIcon'
import LockIcon from '../../../../../icons/LockIcon'

import SideItem from './SideItem'

interface Props {
  isLocked: boolean
  onMouseEnter: () => void
}

const DragHandle = SortableHandle<Props>(({ isLocked, onMouseEnter }) =>
  isLocked ? (
    <SideItem onMouseEnter={onMouseEnter}>
      <LockIcon />
    </SideItem>
  ) : (
    <SideItem isPointer onMouseEnter={onMouseEnter}>
      <ComponentDragHandleIcon />
    </SideItem>
  ),
)

export default DragHandle
