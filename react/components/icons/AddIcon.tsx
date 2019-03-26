import React from 'react'

interface Props {
  color?: string
  size?: number
}

const AddIcon: React.FunctionComponent<Props> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 5.42773V10.5706"
      stroke={color}
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.42969 8H10.5725"
      stroke={color}
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.1429 14H2.85714C2.384 14 2 13.616 2 13.1429V2.85714C2 2.384 2.384 2 2.85714 2H13.1429C13.616 2 14 2.384 14 2.85714V13.1429C14 13.616 13.616 14 13.1429 14Z"
      stroke={color}
      strokeWidth="1.4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

AddIcon.defaultProps = {
  color: 'currentColor',
  size: 16,
}

export default AddIcon
