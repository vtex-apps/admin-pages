import React from 'react'

interface Props {
  onClick?: () => void
}

const SideButton: React.SFC<Props> = ({ children, onClick }) => (
  <div
    className="ph3 pv5 bg-white hover-bg-light-silver dark-gray"
    onClick={onClick}
  >
    {children}
  </div>
)

export default SideButton
