import classnames from 'classnames'
import React from 'react'
import styles from './ItemForm.css'

interface Props {
  children: React.ReactElement
  shouldShow: boolean
}

const ItemForm: React.FC<Props> = ({ children, shouldShow }) => (
  <div
    className={classnames(
      'accordion-item bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 z-1',
      styles['item-form'],
      {
        [styles['item-form--leave']]: !shouldShow,
      }
    )}
  >
    {children}
  </div>
)

export default React.memo(ItemForm)
