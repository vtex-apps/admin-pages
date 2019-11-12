import React from 'react'

interface Props {
  color?: string
}

const IconDesktop: React.FC<Props> = ({ color = 'currentColor' }) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 16H11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 1H2C1.44772 1 1 1.44771 1 2V11C1 11.5523 1.44772 12 2 12H14C14.5523 12 15 11.5523 15 11V2C15 1.44772 14.5523 1 14 1Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconDesktop
