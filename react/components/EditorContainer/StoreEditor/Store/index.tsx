import React from 'react'
import StoreForm from './StoreForm'

interface Props {
  iframeWindow: Window
}

const Store: React.FunctionComponent<Props> = ({ iframeWindow }) => {
  console.log(iframeWindow)
  return (
    <div className="pa7">
      <StoreForm />
      <div className="w-100 pt7 bb b--muted-4" />
    </div>
  )
}

export default Store
