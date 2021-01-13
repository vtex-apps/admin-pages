import { Binding, Tenant } from 'vtex.tenant-graphql'

const STORE_PRODUCT = 'vtex-storefront'

export const getStoreBindings = (tenant: Tenant) => {
  return tenant.bindings.filter(
    binding => binding.targetProduct === STORE_PRODUCT
  )
}

export const getBindingSelectorOptions = (bindings: Binding[]) =>
  bindings.map(binding => ({
    label: binding.canonicalBaseAddress,
    value: binding.id,
  }))
