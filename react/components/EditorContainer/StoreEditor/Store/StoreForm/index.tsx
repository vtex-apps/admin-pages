import React from 'react'

import withStoreSettings, { FormProps } from './components/withStoreSettings'
import { tryParseJson } from './utils/utils'

const StoreForm: React.FunctionComponent<FormProps> = ({ store }) => {
  console.log('store', store)
  console.log('settings', tryParseJson(store.settings))
  return <div>It works!</div>
}

export default withStoreSettings(StoreForm)
