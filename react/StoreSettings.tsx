import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import AdminStyles from './components/admin/AdminStyles'
import Store from './components/admin/store'

const StoreSettings: React.FC<InjectedIntlProps> = ({ intl }) => (
  <AdminStyles
    title={intl.formatMessage({
      defaultMessage: 'Store settings',
      id: 'admin/pages.editor.store.settings.title',
    })}
  >
    <Store />
  </AdminStyles>
)

export default injectIntl(StoreSettings)
