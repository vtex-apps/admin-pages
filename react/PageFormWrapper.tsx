import React from 'react'

import PageForm from './PageForm'
import { useBinding } from './utils/bindings'

const PageFormWrapper: React.FunctionComponent = () => {
  const [localStorageBinding, setLocalStorageBinding] = useBinding()
  return (
    <PageForm
      localStorageBinding={localStorageBinding}
      setLocalStorageBinding={setLocalStorageBinding}
    />
  )
}

export default PageFormWrapper
