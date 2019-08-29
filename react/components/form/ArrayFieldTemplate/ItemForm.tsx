import classnames from 'classnames'
import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { Button } from 'vtex.styleguide'
import styles from './ItemForm.css'

interface Props extends InjectedIntlProps {
  children: React.ReactElement
  onClose: () => void
  shouldShow: boolean
}

const messages = defineMessages({
  apply: {
    defaultMessage: 'Apply',
    id: 'admin/pages.admin.pages.form.field.array.item.apply',
  },
})

const ItemForm: React.FC<Props> = ({ children, intl, onClose, shouldShow }) => (
  <div
    className={classnames(
      'accordion-item bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 z-1',
      styles['item-form'],
      {
        dn: !shouldShow,
        [styles['item-form--leave']]: !shouldShow,
      }
    )}
  >
    {children}
    <div className="mb5">
      <Button type="button" variation="primary" onClick={onClose}>
        {intl.formatMessage(messages.apply)}
      </Button>
    </div>
  </div>
)

export default React.memo(injectIntl(ItemForm))
