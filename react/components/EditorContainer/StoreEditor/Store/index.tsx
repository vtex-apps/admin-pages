import React from 'react'
import PWAForm from './PWAForm'
import StoreForm from './StoreForm'

const Store: React.FunctionComponent<{}> = () => {
  return (
    <div className="pa7 h-100 overflow-y-auto">
      <StoreForm />
      <div className="pv7">
        <div className="w-100 bb b--muted-4" />
      </div>
      {/* TODO: Advanced settings button */}
      <PWAForm />
    </div>
  )
}

export default Store
