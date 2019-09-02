import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import { NormalizedComponent } from '../typings'

import SortableListItem from './SortableListItem'

interface CustomProps {
  components: NormalizedComponent[]
  onDelete: (treePath: string) => void
  onEdit: (component: NormalizedComponent) => void
  onMouseEnter: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeave: () => void
}

type Props = CustomProps

const SortableList = SortableContainer<Props>(
  ({ components, onDelete, onEdit, onMouseEnter, onMouseLeave }) => (
    <ul className="mv0 pl0 overflow-y-auto">
      {components.map((component, index) => (
        <SortableListItem
          component={component}
          disabled={!component.isSortable}
          index={index}
          key={component.treePath}
          onDelete={onDelete}
          onEdit={onEdit}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </ul>
  )
)

export default SortableList
