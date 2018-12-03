import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import { NormalizedComponent } from '../typings'

import SortableButton from './SortableButton'

interface Props {
  components: NormalizedComponent[]
  isSortable: boolean
  isSorting: boolean
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: () => void
}

const SortableList = SortableContainer<Props>(
  ({
    components,
    isSortable,
    isSorting,
    onEdit,
    onMouseEnter,
    onMouseLeave,
  }) => (
    <ul className="mv0 pl0">
      {components.map((component, index) => (
        <SortableButton
          disabled={!isSortable}
          index={index}
          isSorting={isSorting}
          key={component.treePath}
          onEdit={onEdit}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          shouldRenderDragHandle={isSortable}
          subitems={component.components}
          title={component.name}
          treePath={component.treePath}
        />
      ))}
    </ul>
  ),
)

export default SortableList
