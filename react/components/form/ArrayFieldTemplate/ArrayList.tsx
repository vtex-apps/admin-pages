import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import { ActionMenuOption } from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'
import ItemForm from './ItemForm'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  onClose: () => void
  onOpen: (index: number) => (e: React.MouseEvent | ActionMenuOption) => void
  openItem: number | null
  schema: JSONSchema6
  sorting?: boolean
}

const ArrayList: React.FC<ArrayListProps & SortableContainerProps> = ({
  children,
  items,
  schema,
  openItem,
  onOpen,
  onClose,
  sorting,
}) => (
  <div
    className={`accordion-list-container ${
      sorting ? 'accordion-list-container--sorting' : ''
    }`}
  >
    {openItem === null || openItem >= items.length ? (
      <>
        {children}
        {items.map(element => (
          <ArrayFieldTemplateItem
            key={element.index}
            schema={schema}
            onOpen={onOpen(element.index)}
            onClose={onClose}
            formIndex={element.index}
            showDragHandle={items.length > 1}
            {...element}
          />
        ))}
      </>
    ) : (
      <ItemForm>{items[openItem].children}</ItemForm>
    )}
  </div>
)

export default SortableContainer(ArrayList)
