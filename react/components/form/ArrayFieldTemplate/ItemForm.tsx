import classnames from 'classnames'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

import styles from './styles.css'

export enum ItemEditStyles {
  MODAL = 'MODAL',
  SIDEMENU = 'SIDEMENU'
}
interface Props {
  children: React.ReactElement
  onClose: () => void
  itemEditStyle?: ItemEditStyles
}

const messages = defineMessages({
  apply: {
    defaultMessage: 'Apply',
    id: 'admin/pages.admin.pages.form.field.array.item.apply',
  },
})

const ItemForm: React.FC<Props> = ({
  children,
  onClose,
  itemEditStyle = ItemEditStyles.SIDEMENU,
}) => {
  const intl = useIntl()
  return (
    <div
      className={classnames(`${styles['accordion-item']} bg-white bb b--light-silver`, {
        'absolute left-0 top-0 ph6 w-100 z-1': itemEditStyle === ItemEditStyles.SIDEMENU,
      })}
    >
      {children}
      <div className="mb5">
        <Button type="button" variation="primary" onClick={onClose}>
          {intl.formatMessage(messages.apply)}
        </Button>
      </div>
    </div>
  )
}

export default ItemForm
