import React from 'react'

const ContentLibraryIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" fill="white" />

    <path
      d="M20 7V18C20 19.1046 19.1046 20 18 20H7"
      stroke="#727273"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <mask id="path-2-inside-1" fill="white">
      <rect x="4" y="4" width="14" height="14" rx="1" />
    </mask>

    <rect
      x="4"
      y="4"
      width="14"
      height="14"
      rx="1"
      fill="white"
      stroke="#727273"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      mask="url(#path-2-inside-1)"
    />

    <path
      d="M11 14V8"
      stroke="#727273"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M8 11H14"
      stroke="#727273"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ContentLibraryIcon
