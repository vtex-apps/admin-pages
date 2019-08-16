import React from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import { ActionMenuOption } from '../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  onClose: (index: number) => () => void
  onOpen: (index: number) => (e: React.MouseEvent | ActionMenuOption) => void
  openItem: number | null
  schema: ComponentSchema
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
            isOpen={openItem === element.index}
            onOpen={onOpen(element.index)}
            onClose={onClose(element.index)}
            formIndex={element.index}
            showDragHandle={items.length > 1}
            {...element}
          />
        ))}
      </>
    ) : (
      <ArrayFieldTemplateItem
        key={openItem}
        schema={schema}
        isOpen
        onOpen={onOpen(openItem)}
        onClose={onClose(openItem)}
        formIndex={openItem}
        showDragHandle={items.length > 1}
        {...items[openItem]}
      />
    )}
  </div>
)

export default SortableContainer(ArrayList)
