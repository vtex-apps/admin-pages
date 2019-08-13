import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import { ActionMenuOption } from '../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  onClose: (index: number) => () => void
  onOpen: (index: number) => (e: React.MouseEvent | ActionMenuOption) => void
  openedItem: number[]
  schema: JSONSchema6
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
