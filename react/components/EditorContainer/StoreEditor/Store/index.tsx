import React, { useState } from 'react'
import PWAForm from './PWAForm'
import StoreForm from './StoreForm'

const Store: React.FunctionComponent<{}> = () => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  return (
    <div className="pa7 h-100 overflow-y-auto">
      <StoreForm />
      <div className="pv7">
        <div className="w-100 bb b--muted-4" />
      </div>
      {/* FIXME: Put this in tabs instead + intl */}
      {!showAdvanced ? (
        <div
          className="link pointer c-muted-1"
          onClick={() => setShowAdvanced(true)}
        >
          Advanced settings
        </div>
      ) : (
        <>
          <PWAForm />
          <div className="pv7">
            <div className="w-100 bb b--muted-4" />
          </div>
          <div
            className="link pointer c-muted-1"
            onClick={() => setShowAdvanced(false)}
          >
            Hide advanced settings
          </div>
        </>
      )}
    </div>
  )
}

export default Store
