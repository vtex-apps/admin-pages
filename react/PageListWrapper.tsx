import React, { useMemo, useState } from 'react'
import { Query } from 'react-apollo'
import { Tenant } from 'vtex.tenant-graphql'
import { Dropdown } from 'vtex.styleguide'

import Loader from './components/Loader'
import TenantInfo from './queries/TenantInfo.graphql'
import PageList from './PageList'

const STORE_PRODUCT = 'vtex-storefront'

interface BindingSelectorProps {
  tenantInfo: Tenant
}

interface ChangeInput {
  target: {
    value: string
  }
}

const getStoreBindings = (tenant: Tenant) => {
  return tenant.bindings.filter(
    binding => binding.targetProduct === STORE_PRODUCT
  )
}

const PageListWrapperWithQuery = () => {
  return (
    <Query<{ tenantInfo: Tenant }> query={TenantInfo}>
      {({ data, loading: isLoading }) => {
        const tenantInfo = data?.tenantInfo
        return isLoading || !tenantInfo ? (
          <Loader />
        ) : (
          <PageListWrapper tenantInfo={tenantInfo} />
        )
      }}
    </Query>
  )
}

const PageListWrapper: React.FunctionComponent<BindingSelectorProps> = ({
  tenantInfo,
}) => {
  const storeBindings = getStoreBindings(tenantInfo)
  const defaultBinding = storeBindings[0] // Error check here
  const [binding, setSelectedBinding] = useState(defaultBinding)

  const bindingOptions = useMemo(
    () =>
      storeBindings.map(binding => ({
        label: binding.canonicalBaseAddress,
        value: binding.id,
      })),
    [storeBindings]
  )

  const handleChange = ({ target: { value } }: ChangeInput) => {
    const selectedBinding = storeBindings.find(binding => binding.id === value)
    if (!selectedBinding) {
      throw new Error(
        "Selected binding does not exist or isn't a store binding"
      )
    }
    setSelectedBinding(selectedBinding)
  }

  return (
    <div>
      <Dropdown
        disabled={storeBindings.length === 1}
        onChange={handleChange}
        options={bindingOptions}
        value={binding.id}
      />
      <PageList binding={binding.id} />
    </div>
  )
}

export default React.memo(PageListWrapperWithQuery)
