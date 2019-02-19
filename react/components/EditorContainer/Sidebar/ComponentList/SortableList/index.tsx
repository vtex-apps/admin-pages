import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { ToastConsumerRenderProps } from 'vtex.styleguide'

import { NormalizedComponent } from '../typings'

import SortableListItem from './SortableListItem'

interface CustomProps {
  components: NormalizedComponent[]
  onDelete: (treePath: string) => void
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeave: () => void
}

type Props = CustomProps & ToastConsumerRenderProps

const SortableList = SortableContainer<Props>(
  ({
    components,
    onDelete,
    onEdit,
    onMouseEnter,
    onMouseLeave,
  }) => (
    <ul className="mv0 pl0 overflow-y-auto pointer">
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
