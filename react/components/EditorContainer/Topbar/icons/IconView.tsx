import React from 'react'

interface Props {
  color?: string
}

const IconView: React.FC<Props> = ({ color = 'currentColor' }) => (
  <svg
    width="17"
    height="14"
    viewBox="0 0 17 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 7C1 7 4 1.5 8.5 1.5C13 1.5 16 7 16 7C16 7 13 12.5 8.5 12.5C4 12.5 1 7 1 7Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 9.5C9.88071 9.5 11 8.38071 11 7C11 5.61929 9.88071 4.5 8.5 4.5C7.11929 4.5 6 5.61929 6 7C6 8.38071 7.11929 9.5 8.5 9.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default IconView
