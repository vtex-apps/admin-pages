import React, { useMemo } from 'react'
import { Binding, Tenant } from 'vtex.tenant-graphql'

const STORE_PRODUCT = 'vtex-storefront'
const LAST_BINDING_KEY = 'vtex.cms-pages.lastBinding'

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

export const useBinding = (): [
  Binding | undefined,
  React.Dispatch<Binding | undefined>
] => {
  const [binding, setBinding] = React.useState<Binding | undefined>(() => {
    const lastBinding = window.localStorage.getItem(LAST_BINDING_KEY)
    return lastBinding ? (JSON.parse(lastBinding) as Binding) : undefined
  })

  return [
    binding,
    useMemo(() => {
      return (value: Binding | undefined) => {
        if (value) {
          window.localStorage.setItem(LAST_BINDING_KEY, JSON.stringify(value))
        } else {
          window.localStorage.removeItem(LAST_BINDING_KEY)
        }
        setBinding(value)
      }
    }, [setBinding]),
  ]
}
