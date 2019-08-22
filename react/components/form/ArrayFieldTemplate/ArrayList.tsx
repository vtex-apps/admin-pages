import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import { ActionMenuOption } from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'
import ItemForm from './ItemForm'

interface ArrayListProps {
  items: ArrayFieldTemplateProps['items']
  onClose: () => void
  onOpen: (
    index: number
  ) => (e: Pick<React.MouseEvent, 'stopPropagation'> | ActionMenuOption) => void
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
    <>
      {children}
      {items.map(element => (
        <Fragment key={element.index}>
          <ArrayFieldTemplateItem
            schema={schema}
            onOpen={onOpen(element.index)}
            onClose={onClose}
            formIndex={element.index}
            showDragHandle={items.length > 1}
            {...element}
          />
          <ItemForm shouldShow={element.index === openItem}>
            {element.children}
          </ItemForm>
        </Fragment>
      ))}
    </>
  </div>
)

export default SortableContainer(ArrayList)
