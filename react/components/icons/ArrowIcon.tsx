import React from 'react'

interface Props {
  color?: string
}

const ArrowIcon: React.FunctionComponent<Props> = ({ color }) => (
  <svg
    width="5"
    height="9"
    viewBox="0 0 5 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 8.5L5 4.5L0 0.5V8.5Z" fill={color} />
  </svg>
)

ArrowIcon.defaultProps = {
  color: 'currentColor',
}

export default ArrowIcon
