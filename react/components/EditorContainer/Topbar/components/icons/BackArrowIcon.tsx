import React from 'react'

// TODO: Use tachyons on stroke color
const BackArrowIcon: React.SFC = () => (
  <svg
    width="13"
    height="10"
    viewBox="0 0 13 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5L12 5"
      stroke="#134CD8"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 9L1 5L5 1"
      stroke="#134CD8"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export default BackArrowIcon
