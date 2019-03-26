import React from 'react'

const ShowIcon: React.FunctionComponent<{}> = () => (
  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        transform="translate(0.000000, 2.000000)"
        stroke="#979899"
        strokeWidth="1.4"
      >
        <path d="M0.5,6 C0.5,6 3.5,0.5 8,0.5 C12.5,0.5 15.5,6 15.5,6 C15.5,6 12.5,11.5 8,11.5 C3.5,11.5 0.5,6 0.5,6 Z" />
        <circle cx="8" cy="6" r="2.5" />
      </g>
    </g>
  </svg>
)

export default React.memo(ShowIcon)
