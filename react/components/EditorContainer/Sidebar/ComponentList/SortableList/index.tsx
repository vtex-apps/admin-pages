import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { ToastConsumerRenderProps } from 'vtex.styleguide'

import { NormalizedComponent } from '../typings'

import SortableListItem from './SortableListItem'

interface CustomProps {
  components: NormalizedComponent[]
  isSortable: boolean
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
}

type Props = CustomProps & ToastConsumerRenderProps

const SortableList = SortableContainer<Props>(
  ({ components, isSortable, onEdit, onMouseEnter, onMouseLeave }) => (
    <ul className="mv0 pl0 overflow-y-auto pointer">
      {components.map((component, index) => (
        <SortableListItem
          component={component}
          disabled={!isSortable || !component.isSortable}
          index={index}
          key={component.treePath}
          onEdit={onEdit}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          shouldRenderDragHandle={isSortable}
        />
      ))}
    </ul>
  )
)

export default SortableList
