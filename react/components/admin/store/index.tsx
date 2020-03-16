import React from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { Tab, Tabs } from 'vtex.styleguide'

import PWAForm from './PWAForm'
import StoreForm from './StoreForm'

import '../../../styles.global.css'

const messages = defineMessages({
  advanced: {
    defaultMessage: 'Advanced',
    id: 'admin/pages.editor.store.settings.tabs.advanced',
  },
  general: {
    defaultMessage: 'General',
    id: 'admin/pages.editor.store.settings.tabs.general',
  },
  pwa: {
    defaultMessage: 'PWA',
    id: 'admin/pages.editor.store.settings.tabs.pwa',
  },
})

const Store: React.FC<WrappedComponentProps> = ({ intl }) => {
  const [activeTab, setActiveTab] = React.useState<
    'advanced' | 'general' | 'pwa'
  >('general')

  const handleAdvancedOpen = React.useCallback(() => {
    setActiveTab('advanced')
  }, [])

  const handlePWAOpen = React.useCallback(() => {
    setActiveTab('pwa')
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
            <StoreForm advanced />
          </div>
        </Tab>

        <Tab
          active={activeTab === 'pwa'}
          onClick={handlePWAOpen}
          label={intl.formatMessage(messages.pwa)}
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
