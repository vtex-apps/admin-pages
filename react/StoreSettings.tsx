import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import AdminStructure from './components/admin/AdminStructure'
import Store from './components/admin/store'

const StoreSettings: React.FC<InjectedIntlProps> = ({ intl }) => (
  <AdminStructure
    title={intl.formatMessage({
      defaultMessage: 'Store settings',
      id: 'admin/pages.editor.store.settings.title',
    })}
  >
    <Store />
  </AdminStructure>
)

export default injectIntl(StoreSettings)
