import React from 'react'

interface Props {
  color?: string
}

const IconTablet: React.FC<Props> = ({ color = '#979899' }) => (
  <svg
    width="14"
    height="18"
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 15L13 3C13 1.89543 12.1046 1 11 1L3 1C1.89543 1 1 1.89543 1 3L1 15C1 16.1046 1.89543 17 3 17L11 17C12.1046 17 13 16.1046 13 15Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="13" r="0.5" fill="#CACBCC" stroke={color} />
  </svg>
)

export default IconTablet
