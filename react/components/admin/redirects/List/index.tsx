import React from 'react'
import { Query } from 'react-apollo'
import { Tenant } from 'vtex.tenant-graphql'

import Loader from '../../../Loader'
import List, { Props } from './List'
import TenantInfo from '../../../../queries/TenantInfo.graphql'

const ListWrapper: React.FC<Props> = props => {
  return (
    <Query<{ tenantInfo: Tenant }> query={TenantInfo}>
      {({ data, loading: isLoading }) => {
        const tenantInfo = data?.tenantInfo
        return isLoading || !tenantInfo ? <Loader /> : <List {...props} />
      }}
    </Query>
  )
}

export default ListWrapper
