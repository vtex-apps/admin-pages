import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { Modal } from 'vtex.styleguide'

import { ANIMATION_TIMEOUT } from '../../consts'

import transitionStyles from './ItemTransitions.css'
import ItemForm, { ItemEditStyles } from './ItemForm'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'

const transitionClassNames = {
  parent: {
    appear: transitionStyles['item-enter'],
    appearActive: transitionStyles['item-enter-active'],
    appearDone: transitionStyles['item-enter-done'],
    enter: transitionStyles['item-enter'],
    enterActive: transitionStyles['item-enter-active'],
    enterDone: transitionStyles['item-enter-done'],
    exit: transitionStyles['item-exit'],
    exitActive: transitionStyles['item-exit-active'],
    exitDone: transitionStyles['item-exit-done'],
  },
  item: {
    enter: transitionStyles['item-depth-enter'],
    enterActive: transitionStyles['item-depth-enter-active'],
    enterDone: transitionStyles['item-depth-enter-done'],
    exit: transitionStyles['item-depth-exit'],
    exitActive: transitionStyles['item-depth-exit-active'],
    exitDone: transitionStyles['item-depth-exit-done'],
  }

}

type Unpacked<T> = T extends (infer U)[] ? U : T;

interface Props {
  element: Unpacked<ArrayFieldTemplateProps['items']>
  onClose: () => void
  openItem: number | null
  currentDepth: number
  stackDepth: number
  itemEditStyle?: ItemEditStyles
}

const ArrayItemWrapper: React.FC<Props> = ({ element, openItem, currentDepth, stackDepth, onClose, itemEditStyle }) => {
  const Item = (
    <ItemForm onClose={onClose} itemEditStyle={itemEditStyle}>
      {element.children}
    </ItemForm>
  )
  if (itemEditStyle === ItemEditStyles.MODAL) {
    return element.index === openItem ? (
      <Modal isOpen onClose={onClose}>
        {Item}
      </Modal>
    )
      : null
  }

  return (
    <CSSTransition
      appear
      in={element.index === openItem}
      mountOnEnter
      unmountOnExit
      timeout={ANIMATION_TIMEOUT}
      classNames={transitionClassNames.parent}
    >
      <CSSTransition
        in={stackDepth + 1 < currentDepth}
        classNames={transitionClassNames.item}
        timeout={150}
      >
        {Item}
      </CSSTransition>
    </CSSTransition>
  )
}

export default ArrayItemWrapper
