import React from 'react'
import ArrayFieldTemplate, { OverloadbleProps } from './index'
import { ItemEditStyles } from './ItemForm'

const StoreFormArrayFieldTemplate = (props: OverloadbleProps) => {
  return <ArrayFieldTemplate {...props} itemEditStyle={ItemEditStyles.MODAL} itemTitleKey="bindingId" />
}

export default StoreFormArrayFieldTemplate
