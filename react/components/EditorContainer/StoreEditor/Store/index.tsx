import React from 'react'
import StoreForm from './StoreForm'

const Store: React.FunctionComponent<{}> = () => {
  return (
    <div className="pa7 h-100 overflow-y-auto">
      <StoreForm />
      <div className="w-100 pt7 bb b--muted-4" />
    </div>
  )
}

export default Store
