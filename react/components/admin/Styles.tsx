import React from 'react'

interface Props {
  children: React.ReactNode
}

const Styles = (props: Props) => (
  <div className="ma7">{props.children}</div>
)

export default Styles
