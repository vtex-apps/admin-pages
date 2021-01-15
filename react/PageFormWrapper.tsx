import React from 'react'

import PageForm, { Props } from './PageForm'
import { useBinding } from './utils/bindings'

const PageFormWrapper: React.FunctionComponent<Props> = (props: Props) => {
  const [localStorageBinding, setLocalStorageBinding] = useBinding()
  return (
    <PageForm
      {...props}
      localStorageBinding={localStorageBinding}
      setLocalStorageBinding={setLocalStorageBinding}
    />
  )
}

export default PageFormWrapper
