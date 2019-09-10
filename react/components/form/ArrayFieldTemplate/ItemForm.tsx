import classnames from 'classnames'
import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { Button } from 'vtex.styleguide'

import styles from './ItemTransitions.css'

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
      enter: styles['item-depth-enter'],
      enterActive: styles['item-depth-enter-active'],
      enterDone: styles['item-depth-enter-done'],
      exit: styles['item-depth-exit'],
      exitActive: styles['item-depth-exit-active'],
      exitDone: styles['item-depth-exit-done'],
    }}
    timeout={150}
  >
    <div
      className={classnames(
        'accordion-item bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 z-1'
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
