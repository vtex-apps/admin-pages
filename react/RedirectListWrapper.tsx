import React from 'react'
import { Query } from 'react-apollo'
import { Tenant } from 'vtex.tenant-graphql'

import Loader from './components/Loader'
import TenantInfo from './queries/TenantInfo.graphql'
import RedirectList from './RedirectList'
import { getStoreBindings } from './utils/bindings'

const RedirectListWrapper = () => {
  return (
    <Query<{ tenantInfo: Tenant }> query={TenantInfo}>
      {({ data, loading: isLoading }) => {
        const tenantInfo = data?.tenantInfo
        if (isLoading || !tenantInfo) {
          return <Loader />
        }
        const storeBindings = getStoreBindings(tenantInfo)
        return <RedirectList hasMultipleBindings={storeBindings.length > 1} />
      }}
    </Query>
  )
}

export default React.memo(RedirectListWrapper)
