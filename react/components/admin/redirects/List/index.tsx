import React from 'react'
import { Query } from 'react-apollo'
import { Tenant } from 'vtex.tenant-graphql'

import Loader from '../../../Loader'
import List, { Props } from './List'
import TenantInfo from '../../../../queries/TenantInfo.graphql'
import { getStoreBindings } from '../../../../utils/bindings'

const ListWrapper: React.FC<Omit<Props, 'storeBindings'>> = props => {
  return (
    <Query<{ tenantInfo: Tenant }> query={TenantInfo}>
      {({ data, loading: isLoading }) => {
        const tenantInfo = data?.tenantInfo
        if (isLoading || !tenantInfo) {
          return <Loader />
        }
        const storeBindings = getStoreBindings(tenantInfo)
        return <List {...props} storeBindings={storeBindings} />
      }}
    </Query>
  )
}

export default ListWrapper
