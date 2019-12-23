import { JSONSchema6 } from 'json-schema'
import { CSSTransition } from 'react-transition-group'
import React, { Fragment } from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'

import { ANIMATION_TIMEOUT } from '../../consts'
import { ActionMenuOption } from '../../ActionMenu/typings'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'
import ItemForm from './ItemForm'

import styles from './styles.css'
import transitionStyles from './ItemTransitions.css'

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
  appear: transitionStyles['item-enter'],
  appearActive: transitionStyles['item-enter-active'],
  appearDone: transitionStyles['item-enter-done'],
  enter: transitionStyles['item-enter'],
  enterActive: transitionStyles['item-enter-active'],
  enterDone: transitionStyles['item-enter-done'],
  exit: transitionStyles['item-exit'],
  exitActive: transitionStyles['item-exit-active'],
  exitDone: transitionStyles['item-exit-done'],
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
  <div className={sorting ? styles['accordion-list-container--sorting'] : ''}>
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
          timeout={ANIMATION_TIMEOUT}
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
