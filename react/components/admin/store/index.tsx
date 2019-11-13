import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { Tab, Tabs } from 'vtex.styleguide'

import PWAForm from './PWAForm'
import StoreForm from './StoreForm'

import '../../../editbar.global.css'

const messages = defineMessages({
  advanced: {
    defaultMessage: 'Advanced',
    id: 'admin/pages.editor.store.settings.tabs.advanced',
  },
  general: {
    defaultMessage: 'General',
    id: 'admin/pages.editor.store.settings.tabs.general',
  },
})

const Store: React.FC<InjectedIntlProps> = ({ intl }) => {
  const [activeTab, setActiveTab] = React.useState<'advanced' | 'general'>(
    'general'
  )

  const handleAdvancedOpen = React.useCallback(() => {
    setActiveTab('advanced')
  }, [])

  const handleGeneralOpen = React.useCallback(() => {
    setActiveTab('general')
  }, [])

  return (
    <div className="mb7 ph7">
      <Tabs>
        <Tab
          active={activeTab === 'general'}
          onClick={handleGeneralOpen}
          label={intl.formatMessage(messages.general)}
        >
          <div className="pv6">
            <StoreForm />
          </div>
        </Tab>

        <Tab
          active={activeTab === 'advanced'}
          onClick={handleAdvancedOpen}
          label={intl.formatMessage(messages.advanced)}
        >
          <div className="pv6">
            <PWAForm />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default injectIntl(Store)
