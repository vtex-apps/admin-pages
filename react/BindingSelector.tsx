import React, { useMemo, useState } from 'react'
import { Query } from 'react-apollo'
import { Binding, Tenant } from 'vtex.tenant-graphql'
import { Dropdown } from 'vtex.styleguide'

import Loader from './components/Loader'
import TenantInfo from './queries/TenantInfo.graphql'

const STORE_PRODUCT = 'vtex-storefront'

interface BindingSelectorProps {
  tenantInfo: Tenant
}

const getStoreBindings = (tenant: Tenant) => {
  return tenant.bindings.filter(
    binding => binding.targetProduct === STORE_PRODUCT
  )
}

const BindingSelectorWithQuery = () => {
  return (
    <Query<{ tenantInfo: Tenant }> query={TenantInfo}>
      {({ data, loading: isLoading }) => {
        const tenantInfo = data?.tenantInfo
        return isLoading || !tenantInfo ? (
          <Loader />
        ) : (
          <BindingSelector tenantInfo={tenantInfo} />
        )
      }}
    </Query>
  )
}

const BindingSelector: React.FunctionComponent<BindingSelectorProps> = ({
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

  const handleChange = (binding: Binding) => {
    setSelectedBinding(binding)
  }
  return (
    <Dropdown
      onChange={handleChange}
      options={bindingOptions}
      value={binding.id}
    />
  )
}

export default React.memo(BindingSelectorWithQuery)
