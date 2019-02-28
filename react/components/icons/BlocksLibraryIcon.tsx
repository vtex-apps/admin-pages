import React from 'react'

interface Props {
  color?: string
}

const BlocksLibraryIcon: React.FunctionComponent<Props> = ({ color }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 8.5V6.5H3"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 12.531V10.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 16.5H1V14.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 16.5H5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 14.5V16.5H9"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 10.5V12.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 6.5H11V8.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 6.5H7"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 4.5V1.5H16V11.5H13"
      stroke={color}
      stroke-width="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

BlocksLibraryIcon.defaultProps = {
  color: 'currentColor',
}

export default BlocksLibraryIcon
