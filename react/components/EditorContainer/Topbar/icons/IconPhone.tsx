import React from 'react'

interface Props {
  color?: string
}

const IconPhone: React.FC<Props> = ({ color = '#979899' }) => (
  <svg
    width="10"
    height="16"
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 13L9 3C9 1.89543 8.10457 1 7 1L3 1C1.89543 1 1 1.89543 1 3L1 13C1 14.1046 1.89543 15 3 15L7 15C8.10457 15 9 14.1046 9 13Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="5" cy="12" r="0.5" fill="#CACBCC" stroke={color} />
  </svg>
)

export default IconPhone
