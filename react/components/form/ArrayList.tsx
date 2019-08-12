import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  onClose: (index: number) => () => void
  onOpen: (index: number) => (e: React.MouseEvent) => void
  openedItem: number[]
  schema: object
  sorting?: boolean
}

const ArrayList: React.FC<ArrayListProps & SortableContainerProps> = ({
  children,
  items,
  schema,
  openedItem,
  onOpen,
  onClose,
  sorting,
}) => (
  <div
    className={`accordion-list-container ${
      sorting ? 'accordion-list-container--sorting' : ''
    }`}
  >
    {children}
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
