import { JSONSchema6 } from 'json-schema'
import { CSSTransition } from 'react-transition-group'
import React, { Fragment } from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
import { ActionMenuOption } from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'
import ItemForm from './ItemForm'
import styles from './ItemTransitions.css'

interface ArrayListProps {
  formContext: { currentDepth: number }
  items: ArrayFieldTemplateProps['items']
  onClose: () => void
  onOpen: (
    index: number
  ) => (e: Pick<React.MouseEvent, 'stopPropagation'> | ActionMenuOption) => void
  openItem: number | null
  schema: JSONSchema6
  sorting?: boolean
  stackDepth: number
}

const transitionClassNames = {
  appear: styles['item-enter'],
  appearActive: styles['item-enter-active'],
  appearDone: styles['item-enter-done'],
  enter: styles['item-enter'],
  enterActive: styles['item-enter-active'],
  enterDone: styles['item-enter-done'],
  exit: styles['item-exit'],
  exitActive: styles['item-exit-active'],
  exitDone: styles['item-exit-done'],
}

const ArrayList: React.FC<ArrayListProps & SortableContainerProps> = ({
  children,
  formContext,
  items,
  schema,
  openItem,
  onOpen,
  onClose,
  sorting,
  stackDepth,
}) => (
  <div
    className={`accordion-list-container ${
      sorting ? 'accordion-list-container--sorting' : ''
    }`}
  >
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
        <CSSTransition
          appear
          in={element.index === openItem}
          mountOnEnter
          unmountOnExit
          timeout={300}
          classNames={transitionClassNames}
        >
          <ItemForm
            currentDepth={formContext.currentDepth}
            stackDepth={stackDepth + 1}
            onClose={onClose}
          >
            {element.children}
          </ItemForm>
        </CSSTransition>
      </Fragment>
    ))}
  </div>
)

export default SortableContainer(ArrayList)
