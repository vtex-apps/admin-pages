import classnames from 'classnames'
import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { Button } from 'vtex.styleguide'

import styles from './styles.css'
import transitionStyles from './ItemTransitions.css'

interface Props extends InjectedIntlProps {
  children: React.ReactElement
  currentDepth: number
  onClose: () => void
  stackDepth: number
}

const messages = defineMessages({
  apply: {
    defaultMessage: 'Apply',
    id: 'admin/pages.admin.pages.form.field.array.item.apply',
  },
})

const ItemForm: React.FC<Props> = ({
  children,
  currentDepth,
  intl,
  onClose,
  stackDepth,
}) => (
  <CSSTransition
    in={stackDepth < currentDepth}
    classNames={{
      enter: transitionStyles['item-depth-enter'],
      enterActive: transitionStyles['item-depth-enter-active'],
      enterDone: transitionStyles['item-depth-enter-done'],
      exit: transitionStyles['item-depth-exit'],
      exitActive: transitionStyles['item-depth-exit-active'],
      exitDone: transitionStyles['item-depth-exit-done'],
    }}
    timeout={150}
  >
    <div
      className={classnames(
        `${styles['accordion-item']} bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 z-1`
      )}
    >
      {children}
      <div className="mb5">
        <Button type="button" variation="primary" onClick={onClose}>
          {intl.formatMessage(messages.apply)}
        </Button>
      </div>
    </div>
  </CSSTransition>
)

export default injectIntl(ItemForm)
