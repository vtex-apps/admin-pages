import React from 'react'

interface LineProps {
  visible: boolean
}

const Line: React.FunctionComponent<LineProps> = ({ visible }) => {
  if (visible)
    return <div className="mb7 pb7 bb bw1 b--light-silver f3 normal" />
  return <div />
}

export default Line
