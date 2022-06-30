import React from 'react'

interface Props {
  color?: string
}

const CopyContent = ({ color = 'currentColor' }: Props) => (
  <svg
    name="copy"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
  >
    <path
      d="M6.4 0H9.2C10.3046 0 11.2 0.895431 11.2 2V9.2C11.2 10.3046 10.3046 11.2 9.2 11.2H2C0.89543 11.2 0 10.3046 0 9.2V6.4"
      transform="translate(5.80005 12.2) rotate(-90)"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
    <path
      d="M9.2 0H2C0.895431 0 0 0.89543 0 2V9.2C0 10.3046 0.89543 11.2 2 11.2H9.2C10.3046 11.2 11.2 10.3046 11.2 9.2V2C11.2 0.895431 10.3046 0 9.2 0Z"
      transform="translate(1 17) rotate(-90)"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
  </svg>
)

export default CopyContent
