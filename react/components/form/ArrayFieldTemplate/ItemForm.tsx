import classnames from 'classnames'
import React from 'react'

interface Props {
  children: React.ReactElement
}

const ItemForm: React.FC<Props> = props => {
  return (
    <div
      className={classnames(
        'accordion-item bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 h-100 z-1'
      )}
    >
      {props.children}
    </div>
  )
}

export default React.memo(ItemForm)
