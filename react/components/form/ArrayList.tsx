import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  schema: object
  openedItem: number | null
  onOpen: (index: number) => (e: React.MouseEvent) => void
  onClose: () => void
  sorting?: boolean
}

class ArrayList extends React.Component<
  ArrayListProps & SortableContainerProps
> {
  public render() {
    const { items, schema, openedItem, onOpen, onClose, sorting } = this.props
    return (
      <div
        className={`accordion-list-container ${
          sorting ? 'accordion-list-container--sorting' : ''
        }`}
      >
        {items.map(element => (
          <ArrayFieldTemplateItem
            key={element.index}
            children={<div> oi</div>}
            schema={schema}
            isOpen={openedItem === element.index}
            onOpen={onOpen(element.index)}
            onClose={onClose}
            formIndex={element.index}
            showDragHandle={items.length > 1}
            {...element}
          />
        ))}
      </div>
    )
  }
}

export default SortableContainer(ArrayList)
