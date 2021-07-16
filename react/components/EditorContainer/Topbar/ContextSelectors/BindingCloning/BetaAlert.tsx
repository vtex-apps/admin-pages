import React from 'react'
import { Alert } from 'vtex.styleguide'

const BetaAlert = () => {
  // TODO: i18n, although this component probably won't exist at that point
  return (
    <div className="mt5 mb5">
      <Alert type="warning">This feature is under development</Alert>
    </div>
  )
}

export default BetaAlert
