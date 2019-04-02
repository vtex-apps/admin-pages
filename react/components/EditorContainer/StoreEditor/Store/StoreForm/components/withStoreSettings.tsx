import { path } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'

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

const Loading = (): React.ReactElement => (
  <div className="flex justify-center">
    <Spinner />
  </div>
)

const ErrorMessageComponent: React.FunctionComponent<InjectedIntlProps> = ({
  intl,
}): React.ReactElement => (
  <div className="flex justify-center">
    <EmptyState
      title={intl.formatMessage({ id: 'pages.editor.store.settings.error.title' })}
    >
      <FormattedMessage id="pages.editor.store.settings.error" />
    </EmptyState>
  </div>
)
const ErrorMessage = injectIntl(ErrorMessageComponent)

const handleCornerCases = (fn: (x: any) => any) => ({
  loading,
  error,
  data,
  ...rest
}: any) => {
  if (loading) {
    return <Loading />
  }
  if (error || !data) {
    return <ErrorMessage />
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
