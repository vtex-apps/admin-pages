import { path } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'

import { handleCornerCases } from '../../utils/utils'
import AvailableApp from '../queries/AvailableApp.graphql'
import InstalledApp from '../queries/InstalledApp.graphql'
import { tryParseJson } from '../utils/utils'

interface InstalledApp {
  slug: string
  name: string
  vendor: string
  version: string
  settings: string
}

class InstalledAppQuery extends Query<
  { installedApp: InstalledApp },
  { slug: string }
> {}

interface AvailableApp {
  id: string
  title: string
  installed: boolean
  linked: boolean
  installedVersion: string
  settingsSchema: string
  settingsUiSchema: string
}

// tslint:disable-next-line:max-classes-per-file
class AvailableAppQuery extends Query<
  { availableApp: AvailableApp },
  { id: string }
> {}

export interface FormProps {
  store: AvailableApp &
    InstalledApp & {
      settings: string
    }
}

const options = {
  error: {
    description: 'pages.editor.store.settings.error',
    title: 'pages.editor.store.settings.error.title',
  },
}

const withStoreSettings = (
  WrappedComponent: React.ComponentType<FormProps & any>
) => (props: any) => (
  <InstalledAppQuery query={InstalledApp} variables={{ slug: 'vtex.store' }}>
    {handleCornerCases(options, ({ data: storeData }) => {
      const { installedApp: store } = storeData
      const { slug, version } = store
      return (
        <AvailableAppQuery
          query={AvailableApp}
          variables={{ id: `${slug}@${version}` }}
        >
          {handleCornerCases(options, ({ data: { availableApp: schemasData } } = {}) => (
            <WrappedComponent
              {...props}
              store={{
                ...store,
                ...schemasData,
              }}
            />
          ))}
        </AvailableAppQuery>
      )
    })}
  </InstalledAppQuery>
)

export default withStoreSettings
