import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

import ComponentDragHandleIcon from '../../../../../icons/ComponentDragHandleIcon'

import SideItem from './SideItem'

interface Props {
  isExpandable: boolean
  onMouseEnter: () => void
}

const DragHandle = SortableHandle<Props>(({ isExpandable, onMouseEnter }) => (
  <SideItem
    horizontalPaddingClassName={isExpandable ? 'pl3 pr2' : undefined}
    isPointer
    onMouseEnter={onMouseEnter}
  >
    <ComponentDragHandleIcon />
  </SideItem>
))

export default DragHandle
