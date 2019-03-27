import React from 'react'
import { Query } from 'react-apollo'

import { EmptyState, Spinner } from 'vtex.styleguide'

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
  store: AvailableApp & InstalledApp
}

const renderLoading = (): React.ReactElement => (
  <div className="flex justify-center">
    <Spinner />
  </div>
)

// TODO: INTL
const renderError = (): React.ReactElement => (
  <div className="flex justify-center">
    <EmptyState title="Something went wrong">
      We couldn't find the vtex.store data :/
    </EmptyState>
  </div>
)

const withStoreSettings = (
  WrappedComponent: React.ComponentType<FormProps>
) => () => (
  <InstalledAppQuery query={InstalledApp} variables={{ slug: 'vtex.store' }}>
    {({ loading, error, data: installedAppData }) => {
      if (loading) {
        return renderLoading()
      }
      if (error || !installedAppData) {
        return renderError()
      }

      const { installedApp: store } = installedAppData
      return (
        <AvailableAppQuery
          query={AvailableApp}
          variables={{ id: `${store.slug}@${store.version}` }}
        >
          {({ loading: secondLoading, error: secondError, data }) => {
            if (secondLoading) {
              return renderLoading()
            }
            if (secondError || !data) {
              return renderError()
            }
            return (
              <WrappedComponent
                store={{
                  ...store,
                  ...data.availableApp,
                }}
              />
            )
          }}
        </AvailableAppQuery>
      )
    }}
  </InstalledAppQuery>
)

export default withStoreSettings
