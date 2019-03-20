import React from 'react'

interface Props {
  iframeWindow: Window
}

const Store: React.FunctionComponent<Props> = ({ iframeWindow }) => {
  console.log(iframeWindow)
  return (
    <div className="pa5">
      <p>It works!</p>
      <div className="w-100 pt7 bb b--muted-4"/>
    </div>
  )
}

export default Store
