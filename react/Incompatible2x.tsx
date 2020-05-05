import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import semver from 'semver'

interface Props {
  children: ({isMajor2}: {isMajor2: boolean}) => React.ReactElement<any>
}

const GET_STORE_VERSION = gql(`
query InstalledStoreVersion {
  installedApp(slug: "vtex.store") {
    version
  }
}
`)

const IncompatibleMajor: React.SFC<Props> = ({children}) => (
  <Query query={GET_STORE_VERSION}>
    {({data}) => {
      const installedApp = data && data.installedApp
      const isMajor2 = installedApp && semver.satisfies(semver.coerce(installedApp.version) || '', '2.x')
      return (
        children({isMajor2})
      )
    }}
  </Query>
)

export default IncompatibleMajor
