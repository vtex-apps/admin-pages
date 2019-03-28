import { path } from 'ramda'
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
  store: AvailableApp &
    InstalledApp & {
      settings: string
    }
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

const handleCornerCases = (fn: (x: any) => any) => ({
  loading,
  error,
  data,
  ...rest
}: any) => {
  if (loading) {
    return renderLoading()
  }
  if (error || !data) {
    return renderError()
  }

  return fn({ data, ...rest })
}

const withStoreSettings = (
  WrappedComponent: React.ComponentType<FormProps & any>
) => (props: any) => (
  <InstalledAppQuery query={InstalledApp} variables={{ slug: 'vtex.store' }}>
    {handleCornerCases(({ data: storeData }) => {
      const { installedApp: store } = storeData
      const { slug, version } = store
      return (
        <AvailableAppQuery
          query={AvailableApp}
          variables={{ id: `${slug}@${version}` }}
        >
          {handleCornerCases(({ data: { availableApp: schemasData } } = {}) => (
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
