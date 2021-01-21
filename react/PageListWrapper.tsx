import React, { useMemo, useState } from 'react'
import { Query } from 'react-apollo'
import { Tenant } from 'vtex.tenant-graphql'
import { Dropdown } from 'vtex.styleguide'

import Loader from './components/Loader'
import TenantInfo from './queries/TenantInfo.graphql'
import PageList from './PageList'
import {
  getBindingSelectorOptions,
  getStoreBindings,
  useBinding,
} from './utils/bindings'
import { DropdownChangeInput } from './utils/bindings/typings'

interface PageListWrapperProps {
  tenantInfo: Tenant
}

interface BindingSelectorWrapper {
  visible: boolean
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

const BindingSelectorWrapper: React.FunctionComponent<BindingSelectorWrapper> = props => {
  const { children, visible } = props
  return visible ? <div className="flex justify-end pb5">{children}</div> : null
}

const PageListWrapper: React.FunctionComponent<PageListWrapperProps> = ({
  tenantInfo,
}) => {
  const storeBindings = useMemo(() => getStoreBindings(tenantInfo), [
    tenantInfo,
  ])
  // Get Binding from local Storage
  const [localStorageBinding, setLocalStorageBinding] = useBinding()
  const defaultBinding = localStorageBinding || storeBindings[0] // [TODO] Error check here
  const [binding, setSelectedBinding] = useState(defaultBinding)

  const bindingOptions = useMemo(
    () => getBindingSelectorOptions(storeBindings),
    [storeBindings]
  )

  const handleChange = ({ target: { value } }: DropdownChangeInput) => {
    const selectedBinding = storeBindings.find(binding => binding.id === value)
    if (!selectedBinding) {
      throw new Error(
        "Selected binding does not exist or isn't a store binding"
      )
    }
    setSelectedBinding(selectedBinding)
    setLocalStorageBinding(selectedBinding)
  }

  return (
    <div>
      <BindingSelectorWrapper visible={storeBindings.length > 1}>
        <Dropdown
          disabled={storeBindings.length === 1}
          onChange={handleChange}
          options={bindingOptions}
          value={binding.id}
        />
      </BindingSelectorWrapper>
      <PageList binding={binding.id} />
    </div>
  )
}

export default React.memo(PageListWrapperWithQuery)
