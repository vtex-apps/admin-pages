import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  schema: object
  openedItem: number[]
  onOpen: (index: number) => (e: React.MouseEvent) => void
  onClose: (index: number) => () => void
  sorting?: boolean
}

const ArrayList = ({
  items,
  schema,
  openedItem,
  onOpen,
  onClose,
  sorting,
}: ArrayListProps & SortableContainerProps) => (
  <div
    className={`accordion-list-container ${
      sorting ? 'accordion-list-container--sorting' : ''
    }`}
  >
    {items.map(element => (
      <ArrayFieldTemplateItem
        key={element.index}
        schema={schema}
        isOpen={openedItem.includes(element.index)}
        onOpen={onOpen(element.index)}
        onClose={onClose(element.index)}
        formIndex={element.index}
        showDragHandle={items.length > 1}
        {...element}
      />
    ))}
  </div>
)

export default SortableContainer(ArrayList)
