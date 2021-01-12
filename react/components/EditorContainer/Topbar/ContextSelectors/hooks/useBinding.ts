import React from 'react'

import { Binding } from '../typings'

const LAST_BINDING_KEY = 'vtex.site-editor.lastBinding'

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
    (value: Binding | undefined) => {
      if (value) {
        window.localStorage.setItem(LAST_BINDING_KEY, JSON.stringify(value))
      } else {
        window.localStorage.removeItem(LAST_BINDING_KEY)
      }
      setBinding(value)
    },
  ]
}
