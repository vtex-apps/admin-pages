import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { ToastConsumerRenderProps } from 'vtex.styleguide'

import { NormalizedComponent } from '../typings'

import SortableButton from './SortableButton'

interface CustomProps {
  components: NormalizedComponent[]
  isSortable: boolean
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: () => void
}

type Props = CustomProps & ToastConsumerRenderProps

const SortableList = SortableContainer<Props>(
  ({ components, isSortable, onEdit, onMouseEnter, onMouseLeave }) => (
    <ul className="mv0 pl0 overflow-y-auto">
      {components.map((component, index) => (
        <SortableButton
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
